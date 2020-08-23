export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	// 1 mega per pokemon
	runMegaEvo(pokemon) {
		if (pokemon.name === 'Struchni' && pokemon.species.name === 'Aggron') pokemon.canMegaEvo = 'Aggron-Mega';
		if (pokemon.name === 'Raj.Shoot' && pokemon.species.name === 'Swampert') pokemon.canMegaEvo = 'Swampert-Mega';
		const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!speciesid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(speciesid, pokemon.getItem(), true);
		if (pokemon.canMegaEvo) {
			pokemon.canMegaEvo = null;
		} else {
			pokemon.canUltraBurst = null;
		}

		this.runEvent('AfterMega', pokemon);

		// Kaiju Bunny becomes Normal/Fairy when mega evolving
		if (['Kaiju Bunny', 'Overneat', 'frostyicelad ❆', 'EpicNikolai'].includes(pokemon.name) && !pokemon.illusion) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
		}

		return true;
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
			const move = this.dex.getMove(moveSlot.move);
			let zMoveName = this.getZMove(move, pokemon, true) || '';
			if (zMoveName) {
				const zMove = this.dex.getMove(zMoveName);
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
			if (!moveData || !moveData.pp) return;
		}

		if (item.zMoveFrom) {
			if (move.name === item.zMoveFrom) return item.zMove as string;
		} else if (item.zMove === true) {
			if (move.type === item.zMoveType) {
				if (move.category === "Status") {
					return move.name;
				} else if (move.zMove?.basePower) {
					return this.zMoveTable[move.type];
				}
			}
		}
	},

	runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove, maxMove, originalTarget) {
		pokemon.activeMoveActions++;
		let target = this.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
		let baseMove = this.dex.getActiveMove(moveOrMoveName);
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (baseMove.id !== 'struggle' && !zMove && !maxMove && !externalMove) {
			const changedMove = this.runEvent('OverrideAction', pokemon, target, baseMove);
			if (changedMove && changedMove !== true) {
				baseMove = this.dex.getActiveMove(changedMove);
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = this.getRandomTarget(pokemon, baseMove);
			}
		}
		let move = baseMove;
		if (zMove) {
			move = this.getActiveZMove(baseMove, pokemon);
		} else if (maxMove) {
			move = this.getActiveMaxMove(baseMove, pokemon);
		}

		move.isExternal = externalMove;

		this.setActiveMove(move, pokemon, target);

		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.queue.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		} */
		const willTryMove = this.runEvent('BeforeMove', pokemon, target, move);
		if (!willTryMove) {
			this.runEvent('MoveAborted', pokemon, target, move);
			this.clearActiveMove(true);
			// The event 'BeforeMove' could have returned false or null
			// false indicates that this counts as a move failing for the purpose of calculating Stomping Tantrum's base power
			// null indicates the opposite, as the Pokemon didn't have an option to choose anything
			pokemon.moveThisTurnResult = willTryMove;
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				pokemon.moveThisTurnResult = false;
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove;
		if (!externalMove) {
			lockedMove = this.runEvent('LockMove', pokemon);
			if (lockedMove === true) lockedMove = false;
			if (!lockedMove) {
				if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
					this.add('cant', pokemon, 'nopp', move);
					const gameConsole = [
						null, 'Game Boy', 'Game Boy Color', 'Game Boy Advance', 'DS', 'DS', '3DS', '3DS',
					][this.gen] || 'Switch';
					this.hint(`This is not a bug, this is really how it works on the ${gameConsole}; try it yourself if you don't believe us.`);
					this.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			} else {
				sourceEffect = this.dex.getEffect('lockedmove');
			}
			pokemon.moveUsed(move, targetLoc);
		}

		// Dancer Petal Dance hack
		// TODO: implement properly
		const noLock = externalMove && !pokemon.volatiles.lockedmove;

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			this.add('-zpower', pokemon);
			// In SSB Z-Moves are limited to 1 per pokemon.
			pokemon.m.zMoveUsed = true;
		}
		const moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove, maxMove);
		if (this.activeMove) move = this.activeMove;
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);

		// Dancer's activation order is completely different from any other event, so it's handled separately
		if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
			const dancers = [];
			for (const currentPoke of this.getAllActive()) {
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
			for (const dancer of dancers) {
				if (this.faintMessages()) break;
				if (dancer.fainted) continue;
				this.add('-activate', dancer, 'ability: Dancer');
				// @ts-ignore - the Dancer ability can't trigger on a move where target is null because it does not copy failed moves.
				const dancersTarget = target.side !== dancer.side && pokemon.side === dancer.side ? target : pokemon;
				// @ts-ignore
				this.runMove(move.id, dancer, this.getTargetLoc(dancersTarget, dancer), this.dex.getAbility('dancer'), undefined, true);
			}
		}
		if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
	},

	// For Jett xx's The Hunt is On!
	useMoveInner(moveOrMoveName, pokemon, target, sourceEffect, zMove, maxMove) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		if (sourceEffect && ['instruct', 'custapberry'].includes(sourceEffect.id)) sourceEffect = null;

		let move = this.dex.getActiveMove(moveOrMoveName);
		if (move.id === 'weatherball' && zMove) {
			// Z-Weather Ball only changes types if it's used directly,
			// not if it's called by Z-Sleep Talk or something.
			this.singleEvent('ModifyType', move, null, pokemon, target, move, move);
			if (move.type !== 'Normal') sourceEffect = move;
		}
		if (zMove || (move.category !== 'Status' && sourceEffect && (sourceEffect as ActiveMove).isZ)) {
			move = this.getActiveZMove(move, pokemon);
		}
		if (maxMove && move.category !== 'Status') {
			// Max move outcome is dependent on the move type after type modifications from ability and the move itself
			this.singleEvent('ModifyType', move, null, pokemon, target, move, move);
			this.runEvent('ModifyType', pokemon, target, move, move);
		}
		if (maxMove || (move.category !== 'Status' && sourceEffect && (sourceEffect as ActiveMove).isMax)) {
			move = this.getActiveMaxMove(move, pokemon);
		}

		if (this.activeMove) {
			move.priority = this.activeMove.priority;
			if (!move.hasBounced) move.pranksterBoosted = this.activeMove.pranksterBoosted;
		}
		const baseTarget = move.target;
		if (target === undefined) target = this.getRandomTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}
		if (sourceEffect) {
			move.sourceEffect = sourceEffect.id;
			move.ignoreAbility = false;
		}
		let moveResult = false;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyType', move, null, pokemon, target, move, move);
		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Target changed in ModifyMove, so we must adjust it here
			// Adjust before the next event so the correct target is passed to the
			// event
			target = this.getRandomTarget(pokemon, move);
		}
		move = this.runEvent('ModifyType', pokemon, target, move, move);
		move = this.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Adjust again
			target = this.getRandomTarget(pokemon, move);
		}
		if (!move || pokemon.fainted) {
			return false;
		}

		let attrs = '';

		let movename = move.name;
		if (move.id === 'hiddenpower') movename = 'Hidden Power';
		if (sourceEffect) attrs += '|[from]' + this.dex.getEffect(sourceEffect);
		if (zMove && move.isZ === true) {
			attrs = '|[anim]' + movename + attrs;
			movename = 'Z-' + movename;
		}
		this.addMove('move', pokemon, movename, target + attrs);

		if (zMove) this.runZPower(move, pokemon);

		if (!target) {
			this.attrLastMove('[notarget]');
			this.add(this.gen >= 5 ? '-fail' : '-notarget', pokemon);
			return false;
		}

		const {targets, pressureTargets} = pokemon.getMoveTargets(move, target);
		if (targets.length) {
			target = targets[targets.length - 1]; // in case of redirection
		}

		if (!sourceEffect || sourceEffect.id === 'pursuit' || sourceEffect.id === 'thehuntison') {
			let extraPP = 0;
			for (const source of pressureTargets) {
				const ppDrop = this.runEvent('DeductPP', source, pokemon, move);
				if (ppDrop !== true) {
					extraPP += ppDrop || 0;
				}
			}
			if (extraPP > 0) {
				pokemon.deductPP(move, extraPP);
			}
		}

		if (!this.singleEvent('TryMove', move, null, pokemon, target, move) ||
			!this.runEvent('TryMove', pokemon, target, move)) {
			move.mindBlownRecoil = false;
			return false;
		}

		this.singleEvent('UseMoveMessage', move, null, pokemon, target, move);

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (this.gen !== 4 && move.selfdestruct === 'always') {
			this.faint(pokemon, pokemon, move);
		}

		let damage: number | false | undefined | '' = false;
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.tryMoveHit(target, pokemon, move);
			if (damage === this.NOT_FAIL) pokemon.moveThisTurnResult = null;
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		} else {
			if (!targets.length) {
				this.attrLastMove('[notarget]');
				this.add(this.gen >= 5 ? '-fail' : '-notarget', pokemon);
				return false;
			}
			if (this.gen === 4 && move.selfdestruct === 'always') {
				this.faint(pokemon, pokemon, move);
			}
			moveResult = this.trySpreadMoveHit(targets, pokemon, move);
		}
		if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
		if (!pokemon.hp) {
			this.faint(pokemon, pokemon, move);
		}

		if (!moveResult) {
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			return false;
		}

		if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing']))) {
			const originalHp = pokemon.hp;
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
			if (pokemon && pokemon !== target && move && move.category !== 'Status') {
				if (pokemon.hp <= pokemon.maxhp / 2 && originalHp > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		}

		return true;
	},
	afterMoveSecondaryEvent(targets, pokemon, move) {
		// console.log(`${targets}, ${pokemon}, ${move}`)
		if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing']))) {
			this.singleEvent('AfterMoveSecondary', move, null, targets[0], pokemon, move);
			this.runEvent('AfterMoveSecondary', targets, pokemon, move);
		}
		return undefined;
	},
	hitStepMoveHitLoop(targets, pokemon, move) { // Temporary name
		const damage: (number | boolean | undefined)[] = [];
		for (const i of targets.keys()) {
			damage[i] = 0;
		}
		move.totalDamage = 0;
		pokemon.lastDamage = 0;
		let targetHits = move.multihit || 1;
		if (Array.isArray(targetHits)) {
			// yes, it's hardcoded... meh
			if (targetHits[0] === 2 && targetHits[1] === 5) {
				if (this.gen >= 5) {
					targetHits = this.sample([2, 2, 3, 3, 4, 5]);
				} else {
					targetHits = this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
				}
			} else {
				targetHits = this.random(targetHits[0], targetHits[1] + 1);
			}
		}
		targetHits = Math.floor(targetHits);
		let nullDamage = true;
		let moveDamage: (number | boolean | undefined)[];
		// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
		const isSleepUsable = move.sleepUsable || this.dex.getMove(move.sourceEffect).sleepUsable;

		let targetsCopy: (Pokemon | false | null)[] = targets.slice(0);
		let hit: number;
		for (hit = 1; hit <= targetHits; hit++) {
			if (damage.includes(false)) break;
			if (hit > 1 && pokemon.status === 'slp' && !isSleepUsable) break;
			if (targets.every(target => !target || !target.hp)) break;
			move.hit = hit;
			if (move.smartTarget && targets.length > 1) {
				targetsCopy = [targets[hit - 1]];
			} else {
				targetsCopy = targets.slice(0);
			}
			const target = targetsCopy[0]; // some relevant-to-single-target-moves-only things are hardcoded
			if (target && typeof move.smartTarget === 'boolean') {
				if (hit > 1) {
					this.addMove('-anim', pokemon, move.name, target);
				} else {
					this.retargetLastMove(target);
				}
			}

			// like this (Triple Kick)
			if (target && move.multiaccuracy && hit > 1) {
				let accuracy = move.accuracy;
				const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
				if (accuracy !== true) {
					if (!move.ignoreAccuracy) {
						const boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
						const boost = this.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) {
							accuracy *= boostTable[boost];
						} else {
							accuracy /= boostTable[-boost];
						}
					}
					if (!move.ignoreEvasion) {
						const boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
						const boost = this.clampIntRange(boosts['evasion'], -6, 6);
						if (boost > 0) {
							accuracy /= boostTable[boost];
						} else if (boost < 0) {
							accuracy *= boostTable[-boost];
						}
					}
				}
				accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
				if (!move.alwaysHit) {
					accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
					if (accuracy !== true && !this.randomChance(accuracy, 100)) break;
				}
			}

			const moveData = move;
			if (!moveData.flags) moveData.flags = {};

			// Modifies targetsCopy (which is why it's a copy)
			[moveDamage, targetsCopy] = this.spreadMoveHit(targetsCopy, pokemon, move, moveData);

			if (!moveDamage.some(val => val !== false)) break;
			nullDamage = false;

			for (const [i, md] of moveDamage.entries()) {
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage[i] = md === true || !md ? 0 : md;
				// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
				// @ts-ignore
				move.totalDamage += damage[i];
			}
			if (move.mindBlownRecoil) {
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.getEffect('Mind Blown'), true);
				move.mindBlownRecoil = false;
			}
			this.eachEvent('Update');
			if (!pokemon.hp && targets.length === 1) {
				hit++; // report the correct number of hits for multihit moves
				break;
			}
		}
		// hit is 1 higher than the actual hit count
		if (hit === 1) return damage.fill(false);
		if (nullDamage) damage.fill(false);
		if (move.multihit && typeof move.smartTarget !== 'boolean') {
			this.add('-hitcount', targets[0], hit - 1);
		}

		if (move.recoil && move.totalDamage) {
			this.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, pokemon, 'recoil');
		}

		if (move.struggleRecoil) {
			let recoilDamage;
			if (this.dex.gen >= 5) {
				recoilDamage = this.clampIntRange(Math.round(pokemon.baseMaxhp / 4), 1);
			} else {
				recoilDamage = this.trunc(pokemon.maxhp / 4);
			}
			this.directDamage(recoilDamage, pokemon, pokemon, {id: 'strugglerecoil'} as Condition);
		}

		// smartTarget messes up targetsCopy, but smartTarget should in theory ensure that targets will never fail, anyway
		if (move.smartTarget) targetsCopy = targets.slice(0);

		for (const [i, target] of targetsCopy.entries()) {
			if (target && pokemon !== target) {
				target.gotAttacked(move, damage[i] as number | false | undefined, pokemon);
			}
		}

		if (move.ohko && !targets[0].hp) this.add('-ohko');

		if (!damage.some(val => !!val || val === 0)) return damage;

		this.eachEvent('Update');

		this.afterMoveSecondaryEvent(targetsCopy.filter(val => !!val) as Pokemon[], pokemon, move);

		if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing']))) {
			for (const [i, d] of damage.entries()) {
				// There are no multihit spread moves, so it's safe to use move.totalDamage for multihit moves
				// The previous check was for `move.multihit`, but that fails for Dragon Darts
				const curDamage = targets.length === 1 ? move.totalDamage : d;
				if (typeof curDamage === 'number' && targets[i].hp) {
					if (targets[i].hp <= targets[i].maxhp / 2 && targets[i].hp + curDamage > targets[i].maxhp / 2) {
						this.runEvent('EmergencyExit', targets[i], pokemon);
					}
				}
			}
		}

		return damage;
	},
};
