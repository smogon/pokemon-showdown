/**
 * Simulator Side
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * There's a lot of ambiguity between the terms "player", "side", "team",
 * and "half-field", which I'll try to explain here:
 *
 * These terms usually all mean the same thing. The exceptions are:
 *
 * - Multi-battle: there are 2 half-fields, 2 teams, 4 sides
 *
 * - Free-for-all: there are 2 half-fields, 4 teams, 4 sides
 *
 * "Half-field" is usually abbreviated to "half".
 *
 * Function naming will be very careful about which term to use. Pay attention
 * if it's relevant to your code.
 *
 * @license MIT
 */

import {Utils} from '../lib';
import type {RequestState} from './battle';
import {Pokemon, EffectState} from './pokemon';
import {State} from './state';
import {toID} from './dex';

/** A single action that can be chosen. */
export interface ChosenAction {
	choice: 'move' | 'switch' | 'instaswitch' | 'team' | 'shift' | 'pass'; 	// action type
	pokemon?: Pokemon; // the pokemon doing the action
	targetLoc?: number; // relative location of the target to pokemon (move action only)
	moveid: string; // a move to use (move action only)
	move?: ActiveMove; // the active move corresponding to moveid (move action only)
	target?: Pokemon; // the target of the action
	index?: number; // the chosen index in Team Preview
	side?: Side; // the action's side
	mega?: boolean | null; // true if megaing or ultra bursting
	zmove?: string; // if zmoving, the name of the zmove
	maxMove?: string; // if dynamaxed, the name of the max move
	terastallize?: string; // if terastallizing, tera type
	priority?: number; // priority of the action
}

/** What the player has chosen to happen. */
export interface Choice {
	cantUndo: boolean; // true if the choice can't be cancelled because of the maybeTrapped issue
	error: string; // contains error text in the case of a choice error
	actions: ChosenAction[]; // array of chosen actions
	forcedSwitchesLeft: number; // number of switches left that need to be performed
	forcedPassesLeft: number; // number of passes left that need to be performed
	switchIns: Set<number>; // indexes of pokemon chosen to switch in
	zMove: boolean; // true if a Z-move has already been selected
	mega: boolean; // true if a mega evolution has already been selected
	ultra: boolean; // true if an ultra burst has already been selected
	dynamax: boolean; // true if a dynamax has already been selected
	terastallize: boolean; // true if a terastallization has already been inputted
}

export class Side {
	readonly battle: Battle;
	readonly id: SideID;
	/** Index in `battle.sides`: `battle.sides[side.n] === side` */
	readonly n: number;

	name: string;
	avatar: string;
	foe: Side = null!; // set in battle.start()
	/** Only exists in multi battle, for the allied side */
	allySide: Side | null = null; // set in battle.start()
	team: PokemonSet[];
	pokemon: Pokemon[];
	active: Pokemon[];

	pokemonLeft: number;
	zMoveUsed: boolean;
	/**
	 * This will be true in any gen before 8 or if the player (or their battle partner) has dynamaxed once already
	 *
	 * Use Side.canDynamaxNow() to check if a side can dynamax instead of this property because only one
	 * player per team can dynamax on any given turn of a gen 8 Multi Battle.
	 */
	dynamaxUsed: boolean;

	faintedLastTurn: Pokemon | null;
	faintedThisTurn: Pokemon | null;
	/** only used by Gen 1 Counter */
	lastSelectedMove: ID = '';

	/** these point to the same object as the ally's, in multi battles */
	sideConditions: {[id: string]: EffectState};
	slotConditions: {[id: string]: EffectState}[];

	activeRequest: AnyObject | null;
	choice: Choice;

	/**
	 * In gen 1, all lastMove stuff is tracked on Side rather than Pokemon
	 * (this is for Counter and Mirror Move)
	 * This is also used for checking Self-KO clause in Pokemon Stadium 2.
	 */
	lastMove: Move | null;

	constructor(name: string, battle: Battle, sideNum: number, team: PokemonSet[]) {
		const sideScripts = battle.dex.data.Scripts.side;
		if (sideScripts) Object.assign(this, sideScripts);

		this.battle = battle;
		this.id = ['p1', 'p2', 'p3', 'p4'][sideNum] as SideID;
		this.n = sideNum;

		this.name = name;
		this.avatar = '';

		this.team = team;
		this.pokemon = [];
		for (let i = 0; i < this.team.length && i < 24; i++) {
			// console.log("NEW POKEMON: " + (this.team[i] ? this.team[i].name : '[unidentified]'));
			this.pokemon.push(new Pokemon(this.team[i], this));
			this.pokemon[i].position = i;
		}

		switch (this.battle.gameType) {
		case 'doubles':
			this.active = [null!, null!];
			break;
		case 'triples': case 'rotation':
			this.active = [null!, null!, null!];
			break;
		default:
			this.active = [null!];
		}

		this.pokemonLeft = this.pokemon.length;
		this.faintedLastTurn = null;
		this.faintedThisTurn = null;
		this.zMoveUsed = false;
		this.dynamaxUsed = this.battle.gen !== 8;

		this.sideConditions = {};
		this.slotConditions = [];
		// Array#fill doesn't work for this
		for (let i = 0; i < this.active.length; i++) this.slotConditions[i] = {};

		this.activeRequest = null;
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
			dynamax: false,
			terastallize: false,
		};

		// old-gens
		this.lastMove = null;
	}

	toJSON(): AnyObject {
		return State.serializeSide(this);
	}

	get requestState(): RequestState {
		if (!this.activeRequest || this.activeRequest.wait) return '';
		if (this.activeRequest.teamPreview) return 'teampreview';
		if (this.activeRequest.forceSwitch) return 'switch';
		return 'move';
	}

	canDynamaxNow(): boolean {
		if (this.battle.gen !== 8) return false;
		// In multi battles, players on a team are alternatingly given the option to dynamax each turn
		// On turn 1, the players on their team's respective left have the first chance (p1 and p2)
		if (this.battle.gameType === 'multi' && this.battle.turn % 2 !== [1, 1, 0, 0][this.n]) return false;
		// if (this.battle.gameType === 'multitriples' && this.battle.turn % 3 !== [1, 1, 2, 2, 0, 0][this.side.n]) {
		//		return false;
		// }
		return !this.dynamaxUsed;
	}

	getChoice() {
		if (this.choice.actions.length > 1 && this.choice.actions.every(action => action.choice === 'team')) {
			return `team ` + this.choice.actions.map(action => action.pokemon!.position + 1).join(', ');
		}
		return this.choice.actions.map(action => {
			switch (action.choice) {
			case 'move':
				let details = ``;
				if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc > 0 ? '+' : ''}${action.targetLoc}`;
				if (action.mega) details += (action.pokemon!.item === 'ultranecroziumz' ? ` ultra` : ` mega`);
				if (action.zmove) details += ` zmove`;
				if (action.maxMove) details += ` dynamax`;
				if (action.terastallize) details += ` terastallize`;
				return `move ${action.moveid}${details}`;
			case 'switch':
			case 'instaswitch':
				return `switch ${action.target!.position + 1}`;
			case 'team':
				return `team ${action.pokemon!.position + 1}`;
			default:
				return action.choice;
			}
		}).join(', ');
	}

	toString() {
		return `${this.id}: ${this.name}`;
	}

	getRequestData(forAlly?: boolean) {
		const data = {
			name: this.name,
			id: this.id,
			pokemon: [] as AnyObject[],
		};
		for (const pokemon of this.pokemon) {
			data.pokemon.push(pokemon.getSwitchRequestData(forAlly));
		}
		return data;
	}

	randomFoe() {
		const actives = this.foes();
		if (!actives.length) return null;
		return this.battle.sample(actives);
	}

	/** Intended as a way to iterate through all foe side conditions - do not use for anything else. */
	foeSidesWithConditions() {
		if (this.battle.gameType === 'freeforall') return this.battle.sides.filter(side => side !== this);

		return [this.foe];
	}
	foePokemonLeft() {
		if (this.battle.gameType === 'freeforall') {
			return this.battle.sides.filter(side => side !== this).map(side => side.pokemonLeft).reduce((a, b) => a + b);
		}

		if (this.foe.allySide) return this.foe.pokemonLeft + this.foe.allySide.pokemonLeft;

		return this.foe.pokemonLeft;
	}
	allies(all?: boolean) {
		// called during the first switch-in, so `active` can still contain nulls at this point
		let allies = this.activeTeam().filter(ally => ally);
		if (!all) allies = allies.filter(ally => !!ally.hp);

		return allies;
	}
	foes(all?: boolean) {
		if (this.battle.gameType === 'freeforall') {
			return this.battle.sides.map(side => side.active[0])
				.filter(pokemon => pokemon && pokemon.side !== this && (all || !!pokemon.hp));
		}
		return this.foe.allies(all);
	}
	activeTeam() {
		if (this.battle.gameType !== 'multi') return this.active;

		return this.battle.sides[this.n % 2].active.concat(this.battle.sides[this.n % 2 + 2].active);
	}
	hasAlly(pokemon: Pokemon) {
		return pokemon.side === this || pokemon.side === this.allySide;
	}

	addSideCondition(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	): boolean {
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		if (source === 'debug') source = this.active[0];
		if (!source) throw new Error(`setting sidecond without a source`);
		if (!source.getSlot) source = (source as any as Side).active[0];

		status = this.battle.dex.conditions.get(status);
		if (this.sideConditions[status.id]) {
			if (!(status as any).onSideRestart) return false;
			return this.battle.singleEvent('SideRestart', status, this.sideConditions[status.id], this, source, sourceEffect);
		}
		this.sideConditions[status.id] = {
			id: status.id,
			target: this,
			source,
			sourceSlot: source.getSlot(),
			duration: status.duration,
		};
		if (status.durationCallback) {
			this.sideConditions[status.id].duration =
				status.durationCallback.call(this.battle, this.active[0], source, sourceEffect);
		}
		if (!this.battle.singleEvent('SideStart', status, this.sideConditions[status.id], this, source, sourceEffect)) {
			delete this.sideConditions[status.id];
			return false;
		}
		this.battle.runEvent('SideConditionStart', source, source, status);
		return true;
	}

	getSideCondition(status: string | Effect): Effect | null {
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.sideConditions[status.id]) return null;
		return status;
	}

	getSideConditionData(status: string | Effect): AnyObject {
		status = this.battle.dex.conditions.get(status) as Effect;
		return this.sideConditions[status.id] || null;
	}

	removeSideCondition(status: string | Effect): boolean {
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.sideConditions[status.id]) return false;
		this.battle.singleEvent('SideEnd', status, this.sideConditions[status.id], this);
		delete this.sideConditions[status.id];
		return true;
	}

	addSlotCondition(
		target: Pokemon | number, status: string | Condition, source: Pokemon | 'debug' | null = null,
		sourceEffect: Effect | null = null
	) {
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		if (source === 'debug') source = this.active[0];
		if (target instanceof Pokemon) target = target.position;
		if (!source) throw new Error(`setting sidecond without a source`);

		status = this.battle.dex.conditions.get(status);
		if (this.slotConditions[target][status.id]) {
			if (!status.onRestart) return false;
			return this.battle.singleEvent('Restart', status, this.slotConditions[target][status.id], this, source, sourceEffect);
		}
		const conditionState = this.slotConditions[target][status.id] = {
			id: status.id,
			target: this,
			source,
			sourceSlot: source.getSlot(),
			duration: status.duration,
		};
		if (status.durationCallback) {
			conditionState.duration =
				status.durationCallback.call(this.battle, this.active[0], source, sourceEffect);
		}
		if (!this.battle.singleEvent('Start', status, conditionState, this.active[target], source, sourceEffect)) {
			delete this.slotConditions[target][status.id];
			return false;
		}
		return true;
	}

	getSlotCondition(target: Pokemon | number, status: string | Effect) {
		if (target instanceof Pokemon) target = target.position;
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.slotConditions[target][status.id]) return null;
		return status;
	}

	removeSlotCondition(target: Pokemon | number, status: string | Effect) {
		if (target instanceof Pokemon) target = target.position;
		status = this.battle.dex.conditions.get(status) as Effect;
		if (!this.slotConditions[target][status.id]) return false;
		this.battle.singleEvent('End', status, this.slotConditions[target][status.id], this.active[target]);
		delete this.slotConditions[target][status.id];
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	send(...parts: (string | number | Function | AnyObject)[]) {
		const sideUpdate = '|' + parts.map(part => {
			if (typeof part !== 'function') return part;
			return part(this);
		}).join('|');
		this.battle.send('sideupdate', `${this.id}\n${sideUpdate}`);
	}

	emitRequest(update: AnyObject) {
		this.battle.send('sideupdate', `${this.id}\n|request|${JSON.stringify(update)}`);
		this.activeRequest = update;
	}

	emitChoiceError(message: string, unavailable?: boolean) {
		this.choice.error = message;
		const type = `[${unavailable ? 'Unavailable' : 'Invalid'} choice]`;
		this.battle.send('sideupdate', `${this.id}\n|error|${type} ${message}`);
		if (this.battle.strictChoices) throw new Error(`${type} ${message}`);
		return false;
	}

	isChoiceDone() {
		if (!this.requestState) return true;
		if (this.choice.forcedSwitchesLeft) return false;

		if (this.requestState === 'teampreview') {
			return this.choice.actions.length >= this.pickedTeamSize();
		}

		// current request is move/switch
		this.getChoiceIndex(); // auto-pass
		return this.choice.actions.length >= this.active.length;
	}

	chooseMove(
		moveText?: string | number,
		targetLoc = 0,
		event: 'mega' | 'zmove' | 'ultra' | 'dynamax' | 'terastallize' | '' = ''
	) {
		if (this.requestState !== 'move') {
			return this.emitChoiceError(`Can't move: You need a ${this.requestState} response`);
		}
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't move: You sent more choices than unfainted Pokémon.`);
		}
		const autoChoose = !moveText;
		const pokemon: Pokemon = this.active[index];

		// Parse moveText (name or index)
		// If the move is not found, the action is invalid without requiring further inspection.

		const request = pokemon.getMoveRequestData();
		let moveid = '';
		let targetType = '';
		if (autoChoose) moveText = 1;
		if (typeof moveText === 'number' || (moveText && /^[0-9]+$/.test(moveText))) {
			// Parse a one-based move index.
			const moveIndex = Number(moveText) - 1;
			if (moveIndex < 0 || moveIndex >= request.moves.length || !request.moves[moveIndex]) {
				return this.emitChoiceError(`Can't move: Your ${pokemon.name} doesn't have a move ${moveIndex + 1}`);
			}
			moveid = request.moves[moveIndex].id;
			targetType = request.moves[moveIndex].target!;
		} else {
			// Parse a move ID.
			// Move names are also allowed, but may cause ambiguity (see client issue #167).
			moveid = toID(moveText);
			if (moveid.startsWith('hiddenpower')) {
				moveid = 'hiddenpower';
			}
			for (const move of request.moves) {
				if (move.id !== moveid) continue;
				targetType = move.target || 'normal';
				break;
			}
			if (!targetType && ['', 'dynamax'].includes(event) && request.maxMoves) {
				for (const [i, moveRequest] of request.maxMoves.maxMoves.entries()) {
					if (moveid === moveRequest.move) {
						moveid = request.moves[i].id;
						targetType = moveRequest.target;
						event = 'dynamax';
						break;
					}
				}
			}
			if (!targetType && ['', 'zmove'].includes(event) && request.canZMove) {
				for (const [i, moveRequest] of request.canZMove.entries()) {
					if (!moveRequest) continue;
					if (moveid === toID(moveRequest.move)) {
						moveid = request.moves[i].id;
						targetType = moveRequest.target;
						event = 'zmove';
						break;
					}
				}
			}
			if (!targetType) {
				return this.emitChoiceError(`Can't move: Your ${pokemon.name} doesn't have a move matching ${moveid}`);
			}
		}

		const moves = pokemon.getMoves();
		if (autoChoose) {
			for (const [i, move] of request.moves.entries()) {
				if (move.disabled) continue;
				if (i < moves.length && move.id === moves[i].id && moves[i].disabled) continue;
				moveid = move.id;
				targetType = move.target!;
				break;
			}
		}
		const move = this.battle.dex.moves.get(moveid);

		// Z-move

		const zMove = event === 'zmove' ? this.battle.actions.getZMove(move, pokemon) : undefined;
		if (event === 'zmove' && !zMove) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't use ${move.name} as a Z-move`);
		}
		if (zMove && this.choice.zMove) {
			return this.emitChoiceError(`Can't move: You can't Z-move more than once per battle`);
		}

		if (zMove) targetType = this.battle.dex.moves.get(zMove).target;

		// Dynamax
		// Is dynamaxed or will dynamax this turn.
		const maxMove = (event === 'dynamax' || pokemon.volatiles['dynamax']) ?
			this.battle.actions.getMaxMove(move, pokemon) : undefined;
		if (event === 'dynamax' && !maxMove) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't use ${move.name} as a Max Move`);
		}

		if (maxMove) targetType = this.battle.dex.moves.get(maxMove).target;

		// Validate targetting

		if (autoChoose) {
			targetLoc = 0;
		} else if (this.battle.actions.targetTypeChoices(targetType)) {
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
			let lockedMoveTargetLoc = pokemon.lastMoveTargetLoc || 0;
			const lockedMoveID = toID(lockedMove);
			if (pokemon.volatiles[lockedMoveID] && pokemon.volatiles[lockedMoveID].targetLoc) {
				lockedMoveTargetLoc = pokemon.volatiles[lockedMoveID].targetLoc;
			}
			this.choice.actions.push({
				choice: 'move',
				pokemon,
				targetLoc: lockedMoveTargetLoc,
				moveid: lockedMoveID,
			});
			return true;
		} else if (!moves.length && !zMove) {
			// Override action and use Struggle if there are no enabled moves with PP
			// Gen 4 and earlier announce a Pokemon has no moves left before the turn begins, and only to that player's side.
			if (this.battle.gen <= 4) this.send('-activate', pokemon, 'move: Struggle');
			moveid = 'struggle';
		} else if (maxMove) {
			// Dynamaxed; only Taunt and Assault Vest disable Max Guard, but the base move must have PP remaining
			if (pokemon.maxMoveDisabled(move)) {
				return this.emitChoiceError(`Can't move: ${pokemon.name}'s ${maxMove.name} is disabled`);
			}
		} else if (!zMove) {
			// Check for disabled moves
			let isEnabled = false;
			let disabledSource = '';
			for (const m of moves) {
				if (m.id !== moveid) continue;
				if (!m.disabled) {
					isEnabled = true;
					break;
				} else if (m.disabledSource) {
					disabledSource = m.disabledSource;
				}
			}
			if (!isEnabled) {
				// Request a different choice
				if (autoChoose) throw new Error(`autoChoose chose a disabled move`);
				const includeRequest = this.updateRequestForPokemon(pokemon, req => {
					let updated = false;
					for (const m of req.moves) {
						if (m.id === moveid) {
							if (!m.disabled) {
								m.disabled = true;
								updated = true;
							}
							if (m.disabledSource !== disabledSource) {
								m.disabledSource = disabledSource;
								updated = true;
							}
							break;
						}
					}
					return updated;
				});
				const status = this.emitChoiceError(`Can't move: ${pokemon.name}'s ${move.name} is disabled`, includeRequest);
				if (includeRequest) this.emitRequest(this.activeRequest!);
				return status;
			}
			// The chosen move is valid yay
		}

		// Mega evolution

		const mega = (event === 'mega');
		if (mega && !pokemon.canMegaEvo) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't mega evolve`);
		}
		if (mega && this.choice.mega) {
			return this.emitChoiceError(`Can't move: You can only mega-evolve once per battle`);
		}
		const ultra = (event === 'ultra');
		if (ultra && !pokemon.canUltraBurst) {
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't ultra burst`);
		}
		if (ultra && this.choice.ultra) {
			return this.emitChoiceError(`Can't move: You can only ultra burst once per battle`);
		}
		let dynamax = (event === 'dynamax');
		const canDynamax = this.activeRequest?.active[this.active.indexOf(pokemon)].canDynamax;
		if (dynamax && (this.choice.dynamax || !canDynamax)) {
			if (pokemon.volatiles['dynamax']) {
				dynamax = false;
			} else {
				if (this.battle.gen !== 8) {
					return this.emitChoiceError(`Can't move: Dynamaxing doesn't outside of Gen 8.`);
				} else if (pokemon.side.canDynamaxNow()) {
					return this.emitChoiceError(`Can't move: ${pokemon.name} can't Dynamax now.`);
				} else if (pokemon.side.allySide?.canDynamaxNow()) {
					return this.emitChoiceError(`Can't move: It's your partner's turn to Dynamax.`);
				}
				return this.emitChoiceError(`Can't move: You can only Dynamax once per battle.`);
			}
		}
		const terastallize = (event === 'terastallize');
		if (terastallize && !pokemon.canTerastallize) {
			// Make this work properly
			return this.emitChoiceError(`Can't move: ${pokemon.name} can't Terastallize.`);
		}
		if (terastallize && this.choice.terastallize) {
			return this.emitChoiceError(`Can't move: You can only Terastallize once per battle.`);
		}
		if (terastallize && this.battle.gen !== 9) {
			// Make this work properly
			return this.emitChoiceError(`Can't move: You can only Terastallize in Gen 9.`);
		}

		this.choice.actions.push({
			choice: 'move',
			pokemon,
			targetLoc,
			moveid,
			mega: mega || ultra,
			zmove: zMove,
			maxMove: maxMove ? maxMove.id : undefined,
			terastallize: terastallize ? pokemon.teraType : undefined,
		});

		if (pokemon.maybeDisabled) {
			this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
		}

		if (mega) this.choice.mega = true;
		if (ultra) this.choice.ultra = true;
		if (zMove) this.choice.zMove = true;
		if (dynamax) this.choice.dynamax = true;
		if (terastallize) this.choice.terastallize = true;

		return true;
	}

	updateRequestForPokemon(pokemon: Pokemon, update: (req: AnyObject) => boolean) {
		if (!this.activeRequest?.active) {
			throw new Error(`Can't update a request without active Pokemon`);
		}
		const req = this.activeRequest.active[pokemon.position];
		if (!req) throw new Error(`Pokemon not found in request's active field`);
		return update(req);
	}

	chooseSwitch(slotText?: string) {
		if (this.requestState !== 'move' && this.requestState !== 'switch') {
			return this.emitChoiceError(`Can't switch: You need a ${this.requestState} response`);
		}
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			if (this.requestState === 'switch') {
				return this.emitChoiceError(`Can't switch: You sent more switches than Pokémon that need to switch`);
			}
			return this.emitChoiceError(`Can't switch: You sent more choices than unfainted Pokémon`);
		}
		const pokemon = this.active[index];
		let slot;
		if (!slotText) {
			if (this.requestState !== 'switch') {
				return this.emitChoiceError(`Can't switch: You need to select a Pokémon to switch in`);
			}
			if (!this.choice.forcedSwitchesLeft) return this.choosePass();
			slot = this.active.length;
			while (this.choice.switchIns.has(slot) || this.pokemon[slot].fainted) slot++;
		} else {
			slot = parseInt(slotText) - 1;
		}
		if (isNaN(slot) || slot < 0) {
			// maybe it's a name/species id!
			slot = -1;
			for (const [i, mon] of this.pokemon.entries()) {
				if (slotText!.toLowerCase() === mon.name.toLowerCase() || toID(slotText) === mon.species.id) {
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

		if (this.sideConditions['revivalblessing']) {
			if (!targetPokemon.fainted) {
				return this.emitChoiceError(`Can't switch: You have to pass to a fainted Pokémon`);
			}
			targetPokemon.heal(targetPokemon.maxhp / 2);
			this.battle.add('-heal', targetPokemon, targetPokemon.getHealth, '[from] move: Revival Blessing');
		}

		if (targetPokemon.fainted) {
			if (!this.sideConditions['revivalblessing']) {
				return this.emitChoiceError(`Can't switch: You can't switch to a fainted Pokémon`);
			}
		}

		if (this.requestState === 'move') {
			if (pokemon.trapped) {
				const includeRequest = this.updateRequestForPokemon(pokemon, req => {
					let updated = false;
					if (req.maybeTrapped) {
						delete req.maybeTrapped;
						updated = true;
					}
					if (!req.trapped) {
						req.trapped = true;
						updated = true;
					}
					return updated;
				});
				const status = this.emitChoiceError(`Can't switch: The active Pokémon is trapped`, includeRequest);
				if (includeRequest) this.emitRequest(this.activeRequest!);
				return status;
			} else if (pokemon.maybeTrapped) {
				this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
			}
		} else if (this.requestState === 'switch') {
			if (!this.choice.forcedSwitchesLeft) {
				throw new Error(`Player somehow switched too many Pokemon`);
			}
			this.choice.forcedSwitchesLeft--;
		}

		this.choice.switchIns.add(slot);

		this.choice.actions.push({
			choice: (this.requestState === 'switch' ? 'instaswitch' : 'switch'),
			pokemon,
			target: targetPokemon,
		} as ChosenAction);

		return true;
	}

	/**
	 * The number of pokemon you must choose in Team Preview.
	 *
	 * Note that PS doesn't support choosing fewer than this number of pokemon.
	 * In the games, it is sometimes possible to bring fewer than this, but
	 * since that's nearly always a mistake, we haven't gotten around to
	 * supporting it.
	 */
	pickedTeamSize() {
		return Math.min(this.pokemon.length, this.battle.ruleTable.pickedTeamSize || Infinity);
	}

	chooseTeam(data = '') {
		if (this.requestState !== 'teampreview') {
			return this.emitChoiceError(`Can't choose for Team Preview: You're not in a Team Preview phase`);
		}

		const ruleTable = this.battle.ruleTable;
		let positions = data.split(data.includes(',') ? ',' : '')
			.map(datum => parseInt(datum) - 1);
		const pickedTeamSize = this.pickedTeamSize();

		// make sure positions is exactly of length pickedTeamSize
		// - If too big: the client automatically sends a full list, so we just trim it down to size
		positions.splice(pickedTeamSize);
		// - If too small: we intentionally support only sending leads and having the sim fill in the rest
		if (positions.length === 0) {
			for (let i = 0; i < pickedTeamSize; i++) positions.push(i);
		} else if (positions.length < pickedTeamSize) {
			for (let i = 0; i < pickedTeamSize; i++) {
				if (!positions.includes(i)) positions.push(i);
				// duplicate in input, let the rest of the code handle the error message
				if (positions.length >= pickedTeamSize) break;
			}
		}

		for (const [index, pos] of positions.entries()) {
			if (isNaN(pos) || pos < 0 || pos >= this.pokemon.length) {
				return this.emitChoiceError(`Can't choose for Team Preview: You do not have a Pokémon in slot ${pos + 1}`);
			}
			if (positions.indexOf(pos) !== index) {
				return this.emitChoiceError(`Can't choose for Team Preview: The Pokémon in slot ${pos + 1} can only switch in once`);
			}
		}
		if (ruleTable.maxTotalLevel) {
			let totalLevel = 0;
			for (const pos of positions) totalLevel += this.pokemon[pos].level;

			if (totalLevel > ruleTable.maxTotalLevel) {
				if (!data) {
					// autoChoose
					positions = [...this.pokemon.keys()].sort((a, b) => (this.pokemon[a].level - this.pokemon[b].level))
						.slice(0, pickedTeamSize);
				} else {
					return this.emitChoiceError(`Your selected team has a total level of ${totalLevel}, but it can't be above ${ruleTable.maxTotalLevel}; please select a valid team of ${pickedTeamSize} Pokémon`);
				}
			}
		}
		if (ruleTable.valueRules.has('forceselect')) {
			const species = this.battle.dex.species.get(ruleTable.valueRules.get('forceselect'));
			if (!data) {
				// autoChoose
				positions = [...this.pokemon.keys()].filter(pos => this.pokemon[pos].species.name === species.name)
					.concat([...this.pokemon.keys()].filter(pos => this.pokemon[pos].species.name !== species.name))
					.slice(0, pickedTeamSize);
			} else {
				let hasSelection = false;
				for (const pos of positions) {
					if (this.pokemon[pos].species.name === species.name) {
						hasSelection = true;
						break;
					}
				}
				if (!hasSelection) {
					return this.emitChoiceError(`You must bring ${species.name} to the battle.`);
				}
			}
		}
		for (const [index, pos] of positions.entries()) {
			this.choice.switchIns.add(pos);
			this.choice.actions.push({
				choice: 'team',
				index,
				pokemon: this.pokemon[pos],
				priority: -index,
			} as ChosenAction);
		}

		return true;
	}

	chooseShift() {
		const index = this.getChoiceIndex();
		if (index >= this.active.length) {
			return this.emitChoiceError(`Can't shift: You do not have a Pokémon in slot ${index + 1}`);
		} else if (this.requestState !== 'move') {
			return this.emitChoiceError(`Can't shift: You can only shift during a move phase`);
		} else if (this.battle.gameType !== 'triples') {
			return this.emitChoiceError(`Can't shift: You can only shift to the center in triples`);
		} else if (index === 1) {
			return this.emitChoiceError(`Can't shift: You can only shift from the edge to the center`);
		}
		const pokemon: Pokemon = this.active[index];

		this.choice.actions.push({
			choice: 'shift',
			pokemon,
		} as ChosenAction);

		return true;
	}

	clearChoice() {
		let forcedSwitches = 0;
		let forcedPasses = 0;
		if (this.battle.requestState === 'switch') {
			const canSwitchOut = this.active.filter(pokemon => pokemon?.switchFlag).length;
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
			dynamax: false,
			terastallize: false,
		};
	}

	choose(input: string) {
		if (!this.requestState) {
			return this.emitChoiceError(
				this.battle.ended ? `Can't do anything: The game is over` : `Can't do anything: It's not your turn`
			);
		}

		if (this.choice.cantUndo) {
			return this.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
		}

		this.clearChoice();

		const choiceStrings = (input.startsWith('team ') ? [input] : input.split(','));

		if (choiceStrings.length > this.active.length) {
			return this.emitChoiceError(
				`Can't make choices: You sent choices for ${choiceStrings.length} Pokémon, but this is a ${this.battle.gameType} game!`
			);
		}

		for (const choiceString of choiceStrings) {
			let [choiceType, data] = Utils.splitFirst(choiceString.trim(), ' ');
			data = data.trim();

			switch (choiceType) {
			case 'move':
				const original = data;
				const error = () => this.emitChoiceError(`Conflicting arguments for "move": ${original}`);
				let targetLoc: number | undefined;
				let event: 'mega' | 'zmove' | 'ultra' | 'dynamax' | 'terastallize' | '' = '';
				while (true) {
					// If data ends with a number, treat it as a target location.
					// We need to special case 'Conversion 2' so it doesn't get
					// confused with 'Conversion' erroneously sent with the target
					// '2' (since Conversion targets 'self', targetLoc can't be 2).
					if (/\s(?:-|\+)?[1-3]$/.test(data) && toID(data) !== 'conversion2') {
						if (targetLoc !== undefined) return error();
						targetLoc = parseInt(data.slice(-2));
						data = data.slice(0, -2).trim();
					} else if (data.endsWith(' mega')) {
						if (event) return error();
						event = 'mega';
						data = data.slice(0, -5);
					} else if (data.endsWith(' zmove')) {
						if (event) return error();
						event = 'zmove';
						data = data.slice(0, -6);
					} else if (data.endsWith(' ultra')) {
						if (event) return error();
						event = 'ultra';
						data = data.slice(0, -6);
					} else if (data.endsWith(' dynamax')) {
						if (event) return error();
						event = 'dynamax';
						data = data.slice(0, -8);
					} else if (data.endsWith(' gigantamax')) {
						if (event) return error();
						event = 'dynamax';
						data = data.slice(0, -11);
					} else if (data.endsWith(' max')) {
						if (event) return error();
						event = 'dynamax';
						data = data.slice(0, -4);
					} else if (data.endsWith(' terastal')) {
						if (event) return error();
						event = 'terastallize';
						data = data.slice(0, -9);
					} else if (data.endsWith(' terastallize')) {
						if (event) return error();
						event = 'terastallize';
						data = data.slice(0, -13);
					} else {
						break;
					}
				}
				if (!this.chooseMove(data, targetLoc, event)) return false;
				break;
			case 'switch':
				this.chooseSwitch(data);
				break;
			case 'shift':
				if (data) return this.emitChoiceError(`Unrecognized data after "shift": ${data}`);
				if (!this.chooseShift()) return false;
				break;
			case 'team':
				if (!this.chooseTeam(data)) return false;
				break;
			case 'pass':
			case 'skip':
				if (data) return this.emitChoiceError(`Unrecognized data after "pass": ${data}`);
				if (!this.choosePass()) return false;
				break;
			case 'auto':
			case 'default':
				this.autoChoose();
				break;
			default:
				this.emitChoiceError(`Unrecognized choice: ${choiceString}`);
				break;
			}
		}

		return !this.choice.error;
	}

	getChoiceIndex(isPass?: boolean) {
		let index = this.choice.actions.length;

		if (!isPass) {
			switch (this.requestState) {
			case 'move':
				// auto-pass
				while (
					index < this.active.length &&
					(this.active[index].fainted || this.active[index].volatiles['commanding'])
				) {
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

	choosePass(): boolean | Side {
		const index = this.getChoiceIndex(true);
		if (index >= this.active.length) return false;
		const pokemon: Pokemon = this.active[index];

		switch (this.requestState) {
		case 'switch':
			if (pokemon.switchFlag) { // This condition will always happen if called by Battle#choose()
				if (!this.choice.forcedPassesLeft) {
					return this.emitChoiceError(`Can't pass: You need to switch in a Pokémon to replace ${pokemon.name}`);
				}
				this.choice.forcedPassesLeft--;
			}
			break;
		case 'move':
			if (!pokemon.fainted && !pokemon.volatiles['commanding']) {
				return this.emitChoiceError(`Can't pass: Your ${pokemon.name} must make a move (or switch)`);
			}
			break;
		default:
			return this.emitChoiceError(`Can't pass: Not a move or switch request`);
		}

		this.choice.actions.push({
			choice: 'pass',
		} as ChosenAction);
		return true;
	}

	/** Automatically finish a choice if not currently complete. */
	autoChoose() {
		if (this.requestState === 'teampreview') {
			if (!this.isChoiceDone()) this.chooseTeam();
		} else if (this.requestState === 'switch') {
			let i = 0;
			while (!this.isChoiceDone()) {
				if (!this.chooseSwitch()) throw new Error(`autoChoose switch crashed: ${this.choice.error}`);
				i++;
				if (i > 10) throw new Error(`autoChoose failed: infinite looping`);
			}
		} else if (this.requestState === 'move') {
			let i = 0;
			while (!this.isChoiceDone()) {
				if (!this.chooseMove()) throw new Error(`autoChoose crashed: ${this.choice.error}`);
				i++;
				if (i > 10) throw new Error(`autoChoose failed: infinite looping`);
			}
		}
		return true;
	}

	destroy() {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (const pokemon of this.pokemon) {
			if (pokemon) pokemon.destroy();
		}

		for (const action of this.choice.actions) {
			delete action.side;
			delete action.pokemon;
			delete action.target;
		}
		this.choice.actions = [];

		// get rid of some possibly-circular references
		this.pokemon = [];
		this.active = [];
		this.foe = null!;
		(this as any).battle = null!;
	}
}
