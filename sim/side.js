/**
 * Simulator Side
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */
'use strict';

const Pokemon = require('./pokemon');

/**
 * An object representing a single action that can be chosen.
 *
 * @typedef {Object} ChosenAction
 * @property {'move' | 'switch' | 'instaswitch' | 'team' | 'shift' | 'pass'} choice - action type
 * @property {Pokemon} [pokemon] - the pokemon doing the action
 * @property {number} [targetLoc] - relative location of the target to pokemon (move action only)
 * @property {string} [moveid] - a move to use (move action only)
 * @property {Pokemon} [target] - the target of the action
 * @property {number} [index] - the chosen index in Team Preview
 * @property {Side} [side] - the action's side
 * @property {?boolean} [mega] - true if megaing or ultra bursting
 * @property {string | undefined} [zmove] - if zmoving, the name of the zmove
 * @property {number} [priority] - priority of the action
 */

/**
 * An object representing what the player has chosen to happen.
 *
 * @typedef {Object} Choice
 * @property {boolean} cantUndo - true if the choice can't be cancelled because of the maybeTrapped issue
 * @property {string} error - contains error text in the case of a choice error
 * @property {ChosenAction[]} actions - array of chosen actions
 * @property {number} forcedSwitchesLeft - number of switches left that need to be performed
 * @property {number} forcedPassesLeft - number of passes left that need to be performed
 * @property {Set<number>} switchIns - indexes of pokemon chosen to switch in
 * @property {boolean} zMove - true if a Z-move has already been selected
 * @property {boolean} mega - true if a mega evolution has already been selected
 * @property {boolean} ultra - true if an ultra burst has already been selected
 */

class Side {
	/**
	 * @param {string} name
	 * @param {Battle} battle
	 * @param {number} sideNum
	 * @param {PokemonSet[]} team
	 */
	constructor(name, battle, sideNum, team) {
		let sideScripts = battle.data.Scripts.side;
		if (sideScripts) Object.assign(this, sideScripts);

		/**@type {Battle} */
		this.battle = battle;
		this.n = sideNum;
		this.name = name;
		this.avatar = '';

		/** @type {Pokemon[]} */
		this.pokemon = [];
		/** @type {Pokemon[]} */
		// @ts-ignore
		this.active = [null];
		this.sideConditions = {};

		this.pokemonLeft = 0;
		this.faintedLastTurn = false;
		this.faintedThisTurn = false;
		this.zMoveUsed = false;
		/** @type {Choice} */
		this.choice = {
			cantUndo: false,
			error: ``,
			actions: [],
			forcedSwitchesLeft: 0,
			forcedPassesLeft: 0,
			switchIns: new Set(),
			zMove: false,
			mega: false,
			ultra: false,
		};
		/**
		 * Must be one of:
		 * 'move' - Move request, at the beginning of every turn
		 * 'switch' - Switch request, at the end of every turn with fainted Pokémon, or mid-turn for U-turn etc
		 * 'teampreview' - Team Preview, at the beginning of a battle
		 * '' - No request (waiting for other player's switch request)
		 */
		this.currentRequest = '';
		this.maxTeamSize = 6;

		this.id = sideNum ? 'p2' : 'p1';
		/**@type {Side} */
		this.foe = sideNum ? this.battle.sides[0] : this.battle.sides[1];

		switch (this.battle.gameType) {
		case 'doubles':
			// @ts-ignore
			this.active = [null, null];
			break;
		case 'triples': case 'rotation':
			// @ts-ignore
			this.active = [null, null, null];
			break;
		}

		this.team = team;
		for (let i = 0; i < this.team.length && i < 24; i++) {
			//console.log("NEW POKEMON: " + (this.team[i] ? this.team[i].name : '[unidentified]'));
			this.pokemon.push(new Pokemon(this.team[i], this));
		}
		this.pokemonLeft = this.pokemon.length;
		for (const [i, pokemon] of this.pokemon.entries()) {
			pokemon.position = i;
		}

		// old-gens
		/**@type {?Move} */
		this.lastMove = null;
	}

	getChoice() {
		if (this.choice.actions.length > 1 && this.choice.actions.every(action => action.choice === 'team')) {
			return `team ` + this.choice.actions.map(action => action.pokemon.position + 1).join(', ');
		}
		return this.choice.actions.map(action => {
			switch (action.choice) {
			case 'move':
				let details = ``;
				if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc}`;
				if (action.mega) details += ` mega`;
				if (action.zmove) details += ` zmove`;
				return `move ${action.moveid}${details}`;
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
			/**@type {AnyObject[]} */
			pokemon: [],
		};
		for (const pokemon of this.pokemon) {
			let entry = {
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
			};
			if (this.battle.gen > 6) entry.ability = pokemon.ability;
			data.pokemon.push(entry);
		}
		return data;
	}

	randomActive() {
		let actives = this.active.filter(active => active && !active.fainted);
		if (!actives.length) return null;
		return this.battle.sample(actives);
	}

	/**
	 * @param {string | Effect} status
	 * @param {Pokemon?} source
	 * @param {Effect?} sourceEffect
	 */
	addSideCondition(status, source = null, sourceEffect = null) {
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

	/**
	 * @param {string | Effect} status
	 */
	getSideCondition(status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return null;
		return status;
	}

	/**
	 * @param {string | Effect} status
	 */
	removeSideCondition(status) {
		status = this.battle.getEffect(status);
		if (!this.sideConditions[status.id]) return false;
		this.battle.singleEvent('End', status, this.sideConditions[status.id], this);
		delete this.sideConditions[status.id];
		return true;
	}

	/**
	 * @param {(string | number | Function | AnyObject)[]} parts
	 */
	send(...parts) {
		let sideUpdate = '|' + parts.map(part => {
			if (typeof part !== 'function') return part;
			return part(this);
		}).join('|');
		this.battle.send('sideupdate', `${this.id}\n${sideUpdate}`);
	}

	/**
	 * @param {(string | number | AnyObject)[]} args
	 */
	emitCallback(...args) {
		this.battle.send('sideupdate', `${this.id}\n|callback|${args.join('|')}`);
	}

	/**
	 * @param {AnyObject} update
	 */
	emitRequest(update) {
		this.battle.send('sideupdate', `${this.id}\n|request|${JSON.stringify(update)}`);
	}

	/**
	 * @param {string} message
	 */
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

	/**
	 * @param {string | number} [moveText]
	 * @param {number} [targetLoc]
	 * @param {boolean | string} [megaOrZ]
	 */
	chooseMove(moveText, targetLoc, megaOrZ) {
		if (this.currentRequest !== 'move') {
			return this.emitChoiceError(`Can't move: You need a ${this.currentRequest} response`);
		}
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't move: You do not have a Pokémon in slot ${index + 1}`);
		}
		const autoChoose = !moveText;
		/**@type {Pokemon} */
		// @ts-ignore
		const pokemon = this.active[index];

		if (megaOrZ === true) megaOrZ = 'mega';
		if (!targetLoc) targetLoc = 0;

		// Parse moveText (name or index)
		// If the move is not found, the action is invalid without requiring further inspection.

		const requestMoves = pokemon.getRequestData().moves;
		let moveid = '';
		let targetType = '';
		if (autoChoose) moveText = 1;
		if (typeof moveText === 'number' || (moveText && /^[0-9]+$/.test(moveText))) {
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
			for (const move of requestMoves) {
				if (move.id !== moveid) continue;
				targetType = move.target || 'normal';
				break;
			}
			if (!targetType) {
				return this.emitChoiceError(`Can't move: Your ${pokemon.name} doesn't have a move matching ${moveid}`);
			}
		}

		const moves = pokemon.getMoves();
		if (autoChoose) {
			for (const [i, move] of requestMoves.entries()) {
				if (move.disabled) continue;
				if (i < moves.length && move.id === moves[i].id && moves[i].disabled) continue;
				moveid = move.id;
				targetType = move.target;
				break;
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
				moveid: toId(lockedMove),
			});
			return true;
		} else if (!moves.length && !zMove) {
			// Override action and use Struggle if there are no enabled moves with PP
			// Gen 4 and earlier announce a Pokemon has no moves left before the turn begins, and only to that player's side.
			if (this.battle.gen <= 4) this.send('-activate', pokemon, 'move: Struggle');
			moveid = 'struggle';
		} else if (!zMove) {
			// Check for disabled moves
			let isEnabled = false;
			let disabledSource = '';
			for (const moveId of moves) {
				if (moveId.id !== moveid) continue;
				// @ts-ignore
				if (!moveId.disabled) {
					isEnabled = true;
					break;
				// @ts-ignore
				} else if (moveId.disabledSource) {
					// @ts-ignore
					disabledSource = moveId.disabledSource;
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
		const ultra = (megaOrZ === 'ultra');
		if (ultra && !pokemon.canUltraBurst) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't mega evolve`);
		}
		if (ultra && this.choice.ultra) {
			// TODO: The client shouldn't have sent this request in the first place.
			this.emitCallback('cantmega', pokemon);
			return this.emitChoiceError(`Can't move: You can only ultra burst once per battle`);
		}

		this.choice.actions.push({
			choice: 'move',
			pokemon: pokemon,
			targetLoc: targetLoc,
			moveid: moveid,
			mega: mega || ultra,
			zmove: zMove,
		});

		if (pokemon.maybeDisabled) {
			this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
		}

		if (mega) this.choice.mega = true;
		if (ultra) this.choice.ultra = true;
		if (zMove) this.choice.zMove = true;

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkActions()) return this;
		return true;
	}

	/**
	 * @param {string} [slotText]
	 */
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
		let slot;
		if (autoChoose) {
			if (this.currentRequest !== 'switch') {
				return this.emitChoiceError(`Can't switch: You need to select a Pokémon to switch in`);
			}
			if (!this.choice.forcedSwitchesLeft) return this.choosePass();
			slot = this.active.length;
			while (this.choice.switchIns.has(slot) || this.pokemon[slot].fainted) slot++;
		} else {
			// @ts-ignore
			slot = parseInt(slotText) - 1;
		}
		if (isNaN(slot) || slot < 0) {
			// maybe it's a name!
			slot = -1;
			for (const [i, pokemon] of this.pokemon.entries()) {
				if (slotText === pokemon.name) {
					slot = i;
					break;
				}
			}
			if (slot < 0) {
				return this.emitChoiceError(`Can't switch: You do not have a Pokémon named "${slotText}" to switch to`);
			}
		}
		if (slot >= this.pokemon.length) {
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

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkActions()) return this;
		return true;
	}

	/**
	 * @param {string} [data]
	 */
	chooseTeam(data) {
		const autoFill = !data;
		// default to sending team in order
		if (!data) data = `123456`;
		let positions;
		if (data.includes(',')) {
			positions = ('' + data).split(',').map(datum => parseInt(datum) - 1);
		} else {
			positions = ('' + data).split('').map(datum => parseInt(datum) - 1);
		}

		if (autoFill && this.choice.actions.length >= this.maxTeamSize) return true;
		if (this.currentRequest !== 'teampreview') {
			return this.emitChoiceError(`Can't choose for Team Preview: You're not in a Team Preview phase`);
		}

		// hack for >6 pokemon Custom Game
		while (positions.length >= 6 && positions.length < this.maxTeamSize && positions.length < this.pokemon.length) {
			positions.push(positions.length);
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

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkActions()) return this;
		return true;
	}

	chooseShift() {
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
		/**@type {Pokemon} */
		// @ts-ignore
		const pokemon = this.active[index];

		this.choice.actions.push({
			choice: 'shift',
			pokemon: pokemon,
		});

		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkActions()) return this;
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
			zMove: false,
			mega: false,
			ultra: false,
		};
	}

	/**
	 * @param {string} input
	 */
	choose(input) {
		if (!this.currentRequest) {
			return this.emitChoiceError(this.battle.ended ? `Can't do anything: The game is over` : `Can't do anything: It's not your turn`);
		}

		if (this.choice.cantUndo) {
			return this.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
		}

		this.clearChoice();

		const choiceStrings = (input.startsWith('team ') ? [input] : input.split(','));

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
				if (/\s-?[1-3]$/.test(data)) {
					targetLoc = parseInt(data.slice(-2));
					data = data.slice(0, data.lastIndexOf(' '));
				}
				const willMega = data.endsWith(' mega') ? 'mega' : '';
				if (willMega) data = data.slice(0, -5);
				const willUltra = data.endsWith(' ultra') ? 'ultra' : '';
				if (willUltra) data = data.slice(0, -6);
				const willZ = data.endsWith(' zmove') ? 'zmove' : '';
				if (willZ) data = data.slice(0, -6);
				this.chooseMove(data, targetLoc, willMega || willUltra || willZ);
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

	/**
	 * @param {boolean} [isPass]
	 */
	getChoiceIndex(isPass) {
		let index = this.choice.actions.length;

		if (!isPass) {
			switch (this.currentRequest) {
			case 'move':
				// auto-pass
				// @ts-ignore
				while (index < this.active.length && this.active[index].fainted) {
					this.choosePass();
					index++;
				}
				break;
			case 'switch':
				// @ts-ignore
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
		/**@type {Pokemon} */
		// @ts-ignore
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
		if (this.battle.LEGACY_API_DO_NOT_USE && !this.battle.checkActions()) return this;
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
		for (const pokemon of this.pokemon) {
			if (pokemon) pokemon.destroy();
		}
		this.pokemon = [];
		this.active = [];

		this.choice.actions.forEach(action => {
			delete action.side;
			delete action.pokemon;
			delete action.target;
		});
		this.choice.actions = [];

		// get rid of some possibly-circular references
		// @ts-ignore - prevent type | null
		this.battle = null;
		// @ts-ignore - prevent type | null
		this.foe = null;
	}
}

module.exports = Side;
