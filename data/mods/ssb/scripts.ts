import {SSBSet} from "./random-teams";
import {FS} from '../../../lib';
import {toID} from '../../../sim/dex-data';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}

const roomauth: {[roomid: string]: {[userid: string]: string}} = {};
/**
 * Given a username and room, returns the auth they have in that room. Used for some conditional messages/effects.
 * Each room is cached on the first call until the process is restarted.
 */
export function getRoomauth(name: string, room: string) {
	const userid = toID(name);
	const roomid = toID(room);
	if (roomauth[roomid]) return roomauth[roomid][userid] || null;
	const roomsList: any[] = JSON.parse(FS('config/chatrooms.json').readIfExistsSync() || '[]');
	const roomData = roomsList.find(r => toID(r.title) === roomid);
	if (!roomData) return null;
	roomauth[roomid] = roomData.auth;
	return roomauth[roomid][userid] || null;
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return Math.floor(Date.now() / 1000) + '|' + group + name;
}

/**
 * Assigns a new set to a Pokémon
 * @param pokemon the Pokemon to assign the set to
 * @param newSet the SSBSet to assign
 */
export function changeSet(context: Battle, pokemon: Pokemon, newSet: SSBSet, changeAbility = false) {
	if (pokemon.transformed) return;
	const evs: StatsTable = {
		hp: newSet.evs?.hp || 0,
		atk: newSet.evs?.atk || 0,
		def: newSet.evs?.def || 0,
		spa: newSet.evs?.spa || 0,
		spd: newSet.evs?.spd || 0,
		spe: newSet.evs?.spe || 0,
	};
	const ivs: StatsTable = {
		hp: newSet.ivs?.hp || 31,
		atk: newSet.ivs?.atk || 31,
		def: newSet.ivs?.def || 31,
		spa: newSet.ivs?.spa || 31,
		spd: newSet.ivs?.spd || 31,
		spe: newSet.ivs?.spe || 31,
	};
	pokemon.set.evs = evs;
	pokemon.set.ivs = ivs;
	if (newSet.nature) pokemon.set.nature = Array.isArray(newSet.nature) ? context.sample(newSet.nature) : newSet.nature;
	const oldShiny = pokemon.set.shiny;
	pokemon.set.shiny = (typeof newSet.shiny === 'number') ? context.randomChance(1, newSet.shiny) : !!newSet.shiny;
	let percent = (pokemon.hp / pokemon.baseMaxhp);
	if (newSet.species === 'Shedinja') percent = 1;
	pokemon.formeChange(newSet.species, context.effect, true);
	if (!pokemon.terastallized && newSet.teraType) {
		const allTypes = context.dex.types.all().map(x => x.name);
		pokemon.teraType = newSet.teraType === 'Any' ?
			allTypes[Math.floor(Math.random() * allTypes.length)] :
			Array.isArray(newSet.teraType) ?
				newSet.teraType[Math.floor(Math.random() * newSet.teraType.length)] :
				newSet.teraType;
	}
	const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
		(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
	if (oldShiny !== pokemon.set.shiny) context.add('replace', pokemon, details);
	if (changeAbility) pokemon.setAbility(newSet.ability as string);

	pokemon.baseMaxhp = pokemon.species.name === 'Shedinja' ? 1 : Math.floor(Math.floor(
		2 * pokemon.species.baseStats.hp + pokemon.set.ivs.hp + Math.floor(pokemon.set.evs.hp / 4) + 100
	) * pokemon.level / 100 + 10);
	const newMaxHP = pokemon.baseMaxhp;
	pokemon.hp = Math.round(newMaxHP * percent);
	pokemon.maxhp = newMaxHP;
	context.add('-heal', pokemon, pokemon.getHealth, '[silent]');
	if (pokemon.item) {
		let item = newSet.item;
		if (typeof item !== 'string') item = item[context.random(item.length)];
		if (context.toID(item) !== (pokemon.item || pokemon.lastItem)) pokemon.setItem(item);
	}
	if (!pokemon.m.datacorrupt) {
		const newMoves = changeMoves(context, pokemon, newSet.moves.concat(newSet.signatureMove));
		pokemon.moveSlots = newMoves;
		// @ts-ignore Necessary so pokemon doesn't get 8 moves
		pokemon.baseMoveSlots = newMoves;
	}
	pokemon.canMegaEvo = context.actions.canMegaEvo(pokemon);
	pokemon.canUltraBurst = context.actions.canUltraBurst(pokemon);
	pokemon.canTerastallize = context.actions.canTerastallize(pokemon);
	context.add('message', `${pokemon.name} changed form!`);
}

/**
 * Assigns new moves to a Pokemon
 * @param pokemon The Pokemon whose moveset is to be modified
 * @param newSet The set whose moves should be assigned
 */
export function changeMoves(context: Battle, pokemon: Pokemon, newMoves: (string | string[])[]) {
	const carryOver = pokemon.moveSlots.slice().map(m => m.pp / m.maxpp);
	// In case there are ever less than 4 moves
	while (carryOver.length < 4) {
		carryOver.push(1);
	}
	const result = [];
	let slot = 0;
	for (const newMove of newMoves) {
		const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
		const move = context.dex.moves.get(context.toID(moveName));
		if (!move.id) continue;
		const moveSlot = {
			move: move.name,
			id: move.id,
			// eslint-disable-next-line max-len
			pp: ((move.noPPBoosts || move.isZ) ? Math.floor(move.pp * carryOver[slot]) : Math.floor((move.pp * (8 / 5)) * carryOver[slot])),
			maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
			target: move.target,
			disabled: false,
			disabledSource: '',
			used: false,
		};
		result.push(moveSlot);
		slot++;
	}
	return result;
}

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9',
	checkMoveMakesContact(move, attacker, defender, announcePads) {
		if (move.flags['contact'] && attacker.hasItem('protectivepads')) {
			if (announcePads) {
				this.add('-activate', defender, this.effect.fullname);
				this.add('-activate', attacker, 'item: Protective Pads');
			}
			return false;
		}
		if (move.id === 'wonderwing') return false;
		return !!move.flags['contact'];
	},
	pokemon: {
		// Modified for Change Tempo
		getMoveTargets(move, target) {
			let targets: Pokemon[] = [];

			switch (move.target) {
			case 'all':
			case 'foeSide':
			case 'allySide':
			case 'allyTeam':
				if (!move.target.startsWith('foe')) {
					targets.push(...this.alliesAndSelf());
				}
				if (!move.target.startsWith('ally')) {
					targets.push(...this.foes(true));
				}
				if (targets.length && !targets.includes(target)) {
					this.battle.retargetLastMove(targets[targets.length - 1]);
				}
				break;
			case 'allAdjacent':
				targets.push(...this.adjacentAllies());
				// falls through
			case 'allAdjacentFoes':
				targets.push(...this.adjacentFoes());
				if (targets.length && !targets.includes(target)) {
					this.battle.retargetLastMove(targets[targets.length - 1]);
				}
				break;
			case 'allies':
				targets = this.alliesAndSelf();
				break;
			default:
				const selectedTarget = target;
				if (!target || (target.fainted && !target.isAlly(this)) && this.battle.gameType !== 'freeforall') {
					// If a targeted foe faints, the move is retargeted
					const possibleTarget = this.battle.getRandomTarget(this, move);
					if (!possibleTarget) return {targets: [], pressureTargets: []};
					target = possibleTarget;
				}
				if (this.battle.activePerHalf > 1 && !move.tracksTarget) {
					const isCharging = move.flags['charge'] && !this.volatiles['twoturnmove'] &&
						!(move.id.startsWith('solarb') && this.battle.field.isWeather(['sunnyday', 'desolateland'])) &&
						!((this.hasItem('powerherb') || this.hasAbility('changetempo')) && move.id !== 'skydrop');
					if (!isCharging) {
						target = this.battle.priorityEvent('RedirectTarget', this, this, move, target);
					}
				}
				if (move.smartTarget) {
					targets = this.getSmartTargets(target, move);
					target = targets[0];
				} else {
					targets.push(target);
				}
				if (target.fainted && !move.isFutureMove) {
					return {targets: [], pressureTargets: []};
				}
				if (selectedTarget !== target) {
					this.battle.retargetLastMove(target);
				}
			}

			// Resolve apparent targets for Pressure.
			let pressureTargets = targets;
			switch (move.pressureTarget) {
			case 'foeSide':
				pressureTargets = this.foes();
				break;
			case 'self':
				pressureTargets = [];
				break;
			// At the moment, there are no other supported targets.
			}

			return {targets, pressureTargets};
		},
	},
	actions: {
		canTerastallize(pokemon) {
			if (
				pokemon.terastallized || pokemon.species.isMega || pokemon.species.isPrimal || pokemon.species.forme === "Ultra" ||
				pokemon.getItem().zMove || pokemon.canMegaEvo || pokemon.side.canDynamaxNow() || this.dex.gen !== 9
			) {
				return null;
			}
			if (pokemon.baseSpecies.id === 'arceus') return null;
			return pokemon.teraType;
		},
		// 1 mega per pokemon
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);
			if (pokemon.canMegaEvo) {
				pokemon.canMegaEvo = null;
			} else {
				pokemon.canUltraBurst = null;
			}

			this.battle.runEvent('AfterMega', pokemon);

			// Visual mega type changes here
			if ([''].includes(pokemon.name) && !pokemon.illusion) {
				this.battle.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
			}

			this.battle.add('-ability', pokemon, `${pokemon.getAbility().name}`);

			return true;
		},

		// Modded for Mega Rayquaza
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if (altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			// a hacked-in Megazard X can mega evolve into Megazard Y, but not into Megazard X
			if (item.megaEvolves === species.baseSpecies && item.megaStone !== species.name) {
				return item.megaStone;
			}
			return null;
		},

		// 1 Z per pokemon
		canZMove(pokemon) {
			if (pokemon.m.zMoveUsed ||
				(pokemon.transformed &&
					(pokemon.species.isMega || pokemon.species.isPrimal || pokemon.species.forme === "Ultra"))
			) return;
			const item = pokemon.getItem();
			if (!item.zMove) return;
			if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
			let atLeastOne = false;
			let mustStruggle = true;
			const zMoves: ZMoveOptions = [];
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.pp <= 0) {
					zMoves.push(null);
					continue;
				}
				if (!moveSlot.disabled) {
					mustStruggle = false;
				}
				const move = this.dex.moves.get(moveSlot.move);
				let zMoveName = this.getZMove(move, pokemon, true) || '';
				if (zMoveName) {
					const zMove = this.dex.moves.get(zMoveName);
					if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
					zMoves.push({move: zMoveName, target: zMove.target});
				} else {
					zMoves.push(null);
				}
				if (zMoveName) atLeastOne = true;
			}
			if (atLeastOne && !mustStruggle) return zMoves;
		},

		getZMove(move, pokemon, skipChecks) {
			const item = pokemon.getItem();
			if (!skipChecks) {
				if (pokemon.m.zMoveUsed) return;
				if (!item.zMove) return;
				if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
				const moveData = pokemon.getMoveData(move);
				// Draining the PP of the base move prevents the corresponding Z-move from being used.
				if (!moveData?.pp) return;
			}

			if (move.name === item.zMoveFrom) {
				return item.zMove as string;
			} else if (item.zMove === true && move.type === item.zMoveType) {
				if (move.category === "Status") {
					return move.name;
				} else if (move.zMove?.basePower) {
					return this.Z_MOVES[move.type];
				}
			}
		},
		runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove, maxMove, originalTarget) {
			pokemon.activeMoveActions++;
			let target = this.battle.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
			let baseMove = this.dex.getActiveMove(moveOrMoveName);
			const pranksterBoosted = baseMove.pranksterBoosted;
			if (baseMove.id !== 'struggle' && !zMove && !maxMove && !externalMove) {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
				if (changedMove && changedMove !== true) {
					baseMove = this.dex.getActiveMove(changedMove);
					if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
					target = this.battle.getRandomTarget(pokemon, baseMove);
				}
			}
			let move = baseMove;
			if (zMove) {
				move = this.getActiveZMove(baseMove, pokemon);
			} else if (maxMove) {
				move = this.getActiveMaxMove(baseMove, pokemon);
			}

			move.isExternal = externalMove;

			this.battle.setActiveMove(move, pokemon, target);

			/* if (pokemon.moveThisTurn) {
				// THIS IS PURELY A SANITY CHECK
				// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
<<<<<<< HEAD
				// USE this.battle.queue.cancelMove INSTEAD
=======
				// USE this.queue.cancelMove INSTEAD
>>>>>>> 9d30a32cd (Add Irpachuza (#14))
				this.battle.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
				this.battle.clearActiveMove(true);
				return;
			} */
			const willTryMove = this.battle.runEvent('BeforeMove', pokemon, target, move);
			if (!willTryMove) {
				this.battle.runEvent('MoveAborted', pokemon, target, move);
				this.battle.clearActiveMove(true);
				// The event 'BeforeMove' could have returned false or null
				// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
				// null indicates the opposite, as the Pokemon didn't have an option to choose anything
				pokemon.moveThisTurnResult = willTryMove;
				return;
			}
			if (move.beforeMoveCallback) {
				if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
					this.battle.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			}
			pokemon.lastDamage = 0;
			let lockedMove;
			if (!externalMove) {
				lockedMove = this.battle.runEvent('LockMove', pokemon);
				if (lockedMove === true) lockedMove = false;
				if (!lockedMove) {
					if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
						this.battle.add('cant', pokemon, 'nopp', move);
						this.battle.clearActiveMove(true);
						pokemon.moveThisTurnResult = false;
						return;
					}
				} else {
					sourceEffect = this.dex.conditions.get('lockedmove');
				}
				pokemon.moveUsed(move, targetLoc);
			}

			// Dancer Petal Dance hack
			// TODO: implement properly
			const noLock = externalMove && !pokemon.volatiles['lockedmove'];

			if (zMove) {
				if (pokemon.illusion) {
					this.battle.singleEvent('End', this.dex.abilities.get('Illusion'), pokemon.abilityState, pokemon);
				}
				this.battle.add('-zpower', pokemon);
				// 1 z move per poke
				pokemon.m.zMoveUsed = true;
			}

			const oldActiveMove = move;

			const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove, maxMove);
			this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
			if (this.battle.activeMove) move = this.battle.activeMove;
			this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMove', pokemon, target, move);

			// Dancer's activation order is completely different from any other event, so it's handled separately
			if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
				const dancers = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
				// Dancer activates in order of lowest speed stat to highest
				// Note that the speed stat used is after any volatile replacements like Speed Swap,
				// but before any multipliers like Agility or Choice Scarf
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort(
					(a, b) => -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder
				);
				const targetOf1stDance = this.battle.activeTarget!;
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					if (dancer.fainted) continue;
					this.battle.add('-activate', dancer, 'ability: Dancer');
					const dancersTarget = !targetOf1stDance.isAlly(dancer) && pokemon.isAlly(dancer) ?
						targetOf1stDance :
						pokemon;
					const dancersTargetLoc = dancer.getLocOf(dancersTarget);
					this.runMove(move.id, dancer, dancersTargetLoc, this.dex.abilities.get('dancer'), undefined, true);
				}
			}
			if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
			this.battle.faintMessages();
			this.battle.checkWin();

			if (this.battle.gen <= 4) {
				// In gen 4, the outermost move is considered the last move for Copycat
				this.battle.activeMove = oldActiveMove;
			}
		},
		useMoveInner(moveOrMoveName, pokemon, target, sourceEffect, zMove, maxMove) {
			if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
			if (sourceEffect && ['instruct', 'custapberry'].includes(sourceEffect.id)) sourceEffect = null;

			let move = this.dex.getActiveMove(moveOrMoveName);
			pokemon.lastMoveUsed = move;
			if (move.id === 'weatherball' && zMove) {
				// Z-Weather Ball only changes types if it's used directly,
				// not if it's called by Z-Sleep Talk or something.
				this.battle.singleEvent('ModifyType', move, null, pokemon, target, move, move);
				if (move.type !== 'Normal') sourceEffect = move;
			}
			if (zMove || (move.category !== 'Status' && sourceEffect && (sourceEffect as ActiveMove).isZ)) {
				move = this.getActiveZMove(move, pokemon);
			}
			if (maxMove && move.category !== 'Status') {
				// Max move outcome is dependent on the move type after type modifications from ability and the move itself
				this.battle.singleEvent('ModifyType', move, null, pokemon, target, move, move);
				this.battle.runEvent('ModifyType', pokemon, target, move, move);
			}
			if (maxMove || (move.category !== 'Status' && sourceEffect && (sourceEffect as ActiveMove).isMax)) {
				move = this.getActiveMaxMove(move, pokemon);
			}

			if (this.battle.activeMove) {
				move.priority = this.battle.activeMove.priority;
				if (!move.hasBounced) move.pranksterBoosted = this.battle.activeMove.pranksterBoosted;
			}
			const baseTarget = move.target;
			let targetRelayVar = {target};
			targetRelayVar = this.battle.runEvent('ModifyTarget', pokemon, target, move, targetRelayVar, true);
			if (targetRelayVar.target !== undefined) target = targetRelayVar.target;
			if (target === undefined) target = this.battle.getRandomTarget(pokemon, move);
			if (move.target === 'self' || move.target === 'allies') {
				target = pokemon;
			}
			if (sourceEffect) {
				move.sourceEffect = sourceEffect.id;
				move.ignoreAbility = (sourceEffect as ActiveMove).ignoreAbility;
			}
			let moveResult = false;

			this.battle.setActiveMove(move, pokemon, target);

			this.battle.singleEvent('ModifyType', move, null, pokemon, target, move, move);
			this.battle.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			if (baseTarget !== move.target) {
				// Target changed in ModifyMove, so we must adjust it here
				// Adjust before the next event so the correct target is passed to the
				// event
				target = this.battle.getRandomTarget(pokemon, move);
			}
			move = this.battle.runEvent('ModifyType', pokemon, target, move, move);
			move = this.battle.runEvent('ModifyMove', pokemon, target, move, move);
			if (baseTarget !== move.target) {
				// Adjust again
				target = this.battle.getRandomTarget(pokemon, move);
			}
			if (!move || pokemon.fainted) {
				return false;
			}

			let attrs = '';

			let movename = move.name;
			if (move.id === 'hiddenpower') movename = 'Hidden Power';
			if (sourceEffect) attrs += `|[from]${sourceEffect.fullname}`;
			if (zMove && move.isZ === true) {
				attrs = '|[anim]' + movename + attrs;
				movename = 'Z-' + movename;
			}
			this.battle.addMove('move', pokemon, movename, target + attrs);

			if (zMove) this.runZPower(move, pokemon);

			if (!target) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add(this.battle.gen >= 5 ? '-fail' : '-notarget', pokemon);
				return false;
			}

			const {targets, pressureTargets} = pokemon.getMoveTargets(move, target);
			if (targets.length) {
				target = targets[targets.length - 1]; // in case of redirection
			}

			// Pursuit Clones support
			const pursuitClones = ['pursuit', 'trivialpursuit', 'attackofopportunity'];
			const callerMoveForPressure = sourceEffect && (sourceEffect as ActiveMove).pp ? sourceEffect as ActiveMove : null;
			if (!sourceEffect || callerMoveForPressure || pursuitClones.includes(sourceEffect.id)) {
				let extraPP = 0;
				for (const source of pressureTargets) {
					const ppDrop = this.battle.runEvent('DeductPP', source, pokemon, move);
					if (ppDrop !== true) {
						extraPP += ppDrop || 0;
					}
				}
				if (extraPP > 0) {
					pokemon.deductPP(callerMoveForPressure || moveOrMoveName, extraPP);
				}
			}

			if (!this.battle.singleEvent('TryMove', move, null, pokemon, target, move) ||
				!this.battle.runEvent('TryMove', pokemon, target, move)) {
				move.mindBlownRecoil = false;
				return false;
			}

			this.battle.singleEvent('UseMoveMessage', move, null, pokemon, target, move);

			if (move.ignoreImmunity === undefined) {
				move.ignoreImmunity = (move.category === 'Status');
			}

			if (this.battle.gen !== 4 && move.selfdestruct === 'always') {
				this.battle.faint(pokemon, pokemon, move);
			}

			let damage: number | false | undefined | '' = false;
			if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
				damage = this.tryMoveHit(targets, pokemon, move);
				if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
				if (damage || damage === 0 || damage === undefined) moveResult = true;
			} else {
				if (!targets.length) {
					this.battle.attrLastMove('[notarget]');
					this.battle.add(this.battle.gen >= 5 ? '-fail' : '-notarget', pokemon);
					return false;
				}
				if (this.battle.gen === 4 && move.selfdestruct === 'always') {
					this.battle.faint(pokemon, pokemon, move);
				}
				moveResult = this.trySpreadMoveHit(targets, pokemon, move);
			}
			if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
			if (!pokemon.hp) {
				this.battle.faint(pokemon, pokemon, move);
			}

			if (!moveResult) {
				this.battle.singleEvent('MoveFail', move, null, target, pokemon, move);
				return false;
			}

			if (
				!move.negateSecondary &&
				!(move.hasSheerForce && pokemon.hasAbility('sheerforce')) &&
				!move.isFutureMove
			) {
				const originalHp = pokemon.hp;
				this.battle.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
				this.battle.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
				if (pokemon && pokemon !== target && move.category !== 'Status') {
					if (pokemon.hp <= pokemon.maxhp / 2 && originalHp > pokemon.maxhp / 2) {
						this.battle.runEvent('EmergencyExit', pokemon, pokemon);
					}
				}
			}

			return true;
		},
		hitStepTryImmunity(targets, pokemon, move) {
			const hitResults = [];
			for (const [i, target] of targets.entries()) {
				if (this.battle.gen >= 6 && move.flags['powder'] && target !== pokemon && !this.dex.getImmunity('powder', target)) {
					this.battle.debug('natural powder immunity');
					this.battle.add('-immune', target);
					hitResults[i] = false;
				} else if (!this.battle.singleEvent('TryImmunity', move, {}, target, pokemon, move)) {
					this.battle.add('-immune', target);
					hitResults[i] = false;
				} else if (this.battle.gen >= 7 && move.pranksterBoosted &&
					// Prankster Clone immunity
					(pokemon.hasAbility('prankster') || pokemon.hasAbility('youkaiofthedusk') || pokemon.volatiles['irpachuza']) &&
					!targets[i].isAlly(pokemon) && !this.dex.getImmunity('prankster', target)) {
					this.battle.debug('natural prankster immunity');
					if (!target.illusion) this.battle.hint("Since gen 7, Dark is immune to Prankster moves.");
					this.battle.add('-immune', target);
					hitResults[i] = false;
				} else {
					hitResults[i] = true;
				}
			}
			return hitResults;
		},
	},
};
