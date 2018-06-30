'use strict';

const CHOOSABLE_TARGETS = new Set(['normal', 'any', 'adjacentAlly', 'adjacentAllyOrSelf', 'adjacentFoe']);

/**@type {BattleScriptsData} */
let BattleScripts = {
	gen: 7,
	/**
	 * runMove is the "outside" move caller. It handles deducting PP,
	 * flinching, full paralysis, etc. All the stuff up to and including
	 * the "POKEMON used MOVE" message.
	 *
	 * For details of the difference between runMove and useMove, see
	 * useMove's info.
	 *
	 * externalMove skips LockMove and PP deduction, mostly for use by
	 * Dancer.
	 */
	runMove: function (move, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
		let target = this.getTarget(pokemon, zMove || move, targetLoc);
		let baseMove = this.getMoveCopy(move);
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (!sourceEffect && toId(move) !== 'struggle' && !zMove) {
			let changedMove = this.runEvent('OverrideAction', pokemon, target, move);
			if (changedMove && changedMove !== true) {
				baseMove = this.getMoveCopy(changedMove);
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = null;
			}
		}
		move = zMove ? this.getZMoveCopy(baseMove, pokemon) : baseMove;

		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		// copy the priority for Quick Guard
		if (zMove) move.priority = baseMove.priority;
		move.isExternal = externalMove;

		this.setActiveMove(move, pokemon, target);

		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		} */
		let willTryMove = this.runEvent('BeforeMove', pokemon, target, move);
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
					let gameConsole = [null, 'Game Boy', 'Game Boy', 'Game Boy Advance', 'DS', 'DS'][this.gen] || '3DS';
					this.add('-hint', "This is not a bug, this is really how it works on the " + gameConsole + "; try it yourself if you don't believe us.");
					this.clearActiveMove(true);
					pokemon.moveThisTurnResult = false;
					return;
				}
			} else {
				sourceEffect = this.getEffect('lockedmove');
			}
			pokemon.moveUsed(move, targetLoc);
		}

		// Dancer Petal Dance hack
		// TODO: implement properly
		let noLock = externalMove && !pokemon.volatiles.lockedmove;

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			this.add('-zpower', pokemon);
			pokemon.side.zMoveUsed = true;
		}
		let moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
		if (this.activeMove) move = this.activeMove;
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);

		// Dancer's activation order is completely different from any other event, so it's handled separately
		if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
			let dancers = [];
			for (const side of this.sides) {
				for (const currentPoke of side.active) {
					if (!currentPoke || !currentPoke.hp || pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('dancer') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
			}
			// Dancer activates in order of lowest speed stat to highest
			// Ties go to whichever Pokemon has had the ability for the least amount of time
			dancers.sort(function (a, b) { return -(b.stats['spe'] - a.stats['spe']) || b.abilityOrder - a.abilityOrder; });
			for (const dancer of dancers) {
				if (this.faintMessages()) break;
				this.add('-activate', dancer, 'ability: Dancer');
				this.runMove(baseMove.id, dancer, 0, this.getAbility('dancer'), undefined, true);
			}
		}
		if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
	},
	/**
	 * useMove is the "inside" move caller. It handles effects of the
	 * move itself, but not the idea of using the move.
	 *
	 * Most caller effects, like Sleep Talk, Nature Power, Magic Bounce,
	 * etc use useMove.
	 *
	 * The only ones that use runMove are Instruct, Pursuit, and
	 * Dancer.
	 */
	useMove: function (move, pokemon, target, sourceEffect, zMove) {
		pokemon.moveThisTurnResult = undefined;
		let oldMoveResult = pokemon.moveThisTurnResult;
		let moveResult = this.useMoveInner(move, pokemon, target, sourceEffect, zMove);
		if (oldMoveResult === pokemon.moveThisTurnResult) pokemon.moveThisTurnResult = moveResult;
		return moveResult;
	},
	useMoveInner: function (move, pokemon, target, sourceEffect, zMove) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		move = this.getMoveCopy(move);
		if (zMove && move.id === 'weatherball') {
			let baseMove = move;
			this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			move = this.getZMoveCopy(move, pokemon);
			move.zPowered = true;
			if (move.type !== 'Normal') sourceEffect = baseMove;
		} else if (zMove || (move.category !== 'Status' && sourceEffect && sourceEffect.isZ && sourceEffect.id !== 'instruct')) {
			move = this.getZMoveCopy(move, pokemon);
			move.zPowered = true;
		}
		if (this.activeMove) {
			move.priority = this.activeMove.priority;
			if (!move.hasBounced) move.pranksterBoosted = this.activeMove.pranksterBoosted;
		}
		let baseTarget = move.target;
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}
		if (sourceEffect) move.sourceEffect = sourceEffect.id;
		let moveResult = false;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Target changed in ModifyMove, so we must adjust it here
			// Adjust before the next event so the correct target is passed to the
			// event
			target = this.resolveTarget(pokemon, move);
		}
		move = this.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Adjust again
			target = this.resolveTarget(pokemon, move);
		}
		if (!move || pokemon.fainted) {
			return false;
		}

		let attrs = '';

		if (move.flags['charge'] && !pokemon.volatiles[move.id]) {
			attrs = '|[still]'; // suppress the default move animation
		}

		let movename = move.name;
		if (move.id === 'hiddenpower') movename = 'Hidden Power';
		if (sourceEffect) attrs += '|[from]' + this.getEffect(sourceEffect);
		if (zMove && move.isZ === true) {
			attrs = '|[anim]' + movename + attrs;
			movename = 'Z-' + movename;
		}
		this.addMove('move', pokemon, movename, target + attrs);

		if (zMove && move.category !== 'Status') {
			this.attrLastMove('[zeffect]');
		} else if (zMove && move.zMoveBoost) {
			// @ts-ignore
			this.boost(move.zMoveBoost, pokemon, pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'heal') {
			// @ts-ignore
			this.heal(pokemon.maxhp, pokemon, pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'healreplacement') {
			move.self = {sideCondition: 'healreplacement'};
		} else if (zMove && move.zMoveEffect === 'clearnegativeboost') {
			let boosts = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					boosts[i] = 0;
				}
			}
			pokemon.setBoost(boosts);
			this.add('-clearnegativeboost', pokemon, '[zeffect]');
		} else if (zMove && move.zMoveEffect === 'redirect') {
			// @ts-ignore
			pokemon.addVolatile('followme', pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'crit2') {
			// @ts-ignore
			pokemon.addVolatile('focusenergy', pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'curse') {
			if (pokemon.hasType('Ghost')) {
				// @ts-ignore
				this.heal(pokemon.maxhp, pokemon, pokemon, {id: 'zpower'});
			} else {
				// @ts-ignore
				this.boost({atk: 1}, pokemon, pokemon, {id: 'zpower'});
			}
		}

		if (target === false) {
			this.attrLastMove('[notarget]');
			this.add('-notarget');
			if (move.target === 'normal') pokemon.isStaleCon = 0;
			return false;
		}

		let targets = pokemon.getMoveTargets(move, target);

		if (!sourceEffect || sourceEffect.id === 'pursuit') {
			let extraPP = 0;
			for (const source of targets) {
				let ppDrop = this.runEvent('DeductPP', source, pokemon, move);
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

		if (move.selfdestruct === 'always') {
			this.faint(pokemon, pokemon, move);
		}

		/**@type {number | false} */
		let damage = false;
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.tryMoveHit(target, pokemon, move);
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		} else if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
			if (!targets.length) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				return false;
			}
			if (targets.length > 1) move.spreadHit = true;
			let hitTargets = [];
			for (const source of targets) {
				let hitResult = this.tryMoveHit(source, pokemon, move);
				if (hitResult || hitResult === 0 || hitResult === undefined) {
					moveResult = true;
					hitTargets.push(source.toString().substr(0, 3));
				}
				if (damage !== false) {
					damage += hitResult || 0;
				} else {
					damage = hitResult;
				}
			}
			if (move.spreadHit) this.attrLastMove('[spread] ' + hitTargets.join(','));
		} else {
			target = targets[0];
			let lacksTarget = target.fainted;
			if (!lacksTarget) {
				if (move.target === 'adjacentFoe' || move.target === 'adjacentAlly' || move.target === 'normal' || move.target === 'randomNormal') {
					lacksTarget = !this.isAdjacent(target, pokemon);
				}
			}
			if (lacksTarget && (!move.flags['charge'] || pokemon.volatiles['twoturnmove'])) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				if (move.target === 'normal') pokemon.isStaleCon = 0;
				return false;
			}
			damage = this.tryMoveHit(target, pokemon, move);
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		}
		// @ts-ignore
		if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
		if (!pokemon.hp) {
			this.faint(pokemon, pokemon, move);
		}

		if (!moveResult) {
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			return false;
		}

		if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
		}
		return true;
	},
	tryMoveHit: function (target, pokemon, move) {
		this.setActiveMove(move, pokemon, target);
		move.zBrokeProtect = false;
		let hitResult = true;

		hitResult = this.singleEvent('PrepareHit', move, {}, target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}
		this.runEvent('PrepareHit', pokemon, target, move);

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
			return false;
		}

		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			if (move.target === 'all') {
				hitResult = this.runEvent('TryHitField', target, pokemon, move);
			} else {
				hitResult = this.runEvent('TryHitSide', target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}
			return this.moveHit(target, pokemon, move);
		}

		hitResult = this.runEvent('TryImmunity', target, pokemon, move);
		if (!hitResult) {
			if (hitResult !== null) {
				if (!move.spreadHit) this.attrLastMove('[miss]');
				this.add('-miss', pokemon, target);
			}
			return false;
		}

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (this.gen < 7 && (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) && !target.runImmunity(move.type, true)) {
			return false;
		}

		hitResult = this.runEvent('TryHit', target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (this.gen >= 7 && (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) && !target.runImmunity(move.type, true)) {
			return false;
		}
		if (move.flags['powder'] && target !== pokemon && !this.getImmunity('powder', target)) {
			this.debug('natural powder immunity');
			this.add('-immune', target, '[msg]');
			return false;
		}
		if (this.gen >= 7 && move.pranksterBoosted && pokemon.hasAbility('prankster') && target.side !== pokemon.side && !this.getImmunity('prankster', target)) {
			this.debug('natural prankster immunity');
			if (!target.illusion) this.add('-hint', "In gen 7, Dark is immune to Prankster moves.");
			this.add('-immune', target, '[msg]');
			return false;
		}

		let boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

		// calculate true accuracy
		let accuracy = move.accuracy;
		let boosts, boost;
		if (accuracy !== true) {
			if (!move.ignoreAccuracy) {
				boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
				boost = this.clampIntRange(boosts['accuracy'], -6, 6);
				if (boost > 0) {
					accuracy *= boostTable[boost];
				} else {
					accuracy /= boostTable[-boost];
				}
			}
			if (!move.ignoreEvasion) {
				boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
				boost = this.clampIntRange(boosts['evasion'], -6, 6);
				if (boost > 0) {
					accuracy /= boostTable[boost];
				} else if (boost < 0) {
					accuracy *= boostTable[-boost];
				}
			}
		}
		if (move.ohko) { // bypasses accuracy modifiers
			if (!target.isSemiInvulnerable()) {
				accuracy = 30;
				if (move.ohko === 'Ice' && this.gen >= 7 && !pokemon.hasType('Ice')) {
					accuracy = 20;
				}
				if (pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) {
					accuracy += (pokemon.level - target.level);
				} else {
					this.add('-immune', target, '[ohko]');
					return false;
				}
			}
		} else {
			accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
		}
		if (move.alwaysHit || (move.id === 'toxic' && this.gen >= 6 && pokemon.hasType('Poison'))) {
			accuracy = true; // bypasses ohko accuracy modifiers
		} else {
			accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
		}
		// @ts-ignore
		if (accuracy !== true && !this.randomChance(accuracy, 100)) {
			if (!move.spreadHit) this.attrLastMove('[miss]');
			this.add('-miss', pokemon, target);
			return false;
		}

		if (move.breaksProtect) {
			let broke = false;
			for (const effectid of ['banefulbunker', 'kingsshield', 'protect', 'spikyshield']) {
				if (target.removeVolatile(effectid)) broke = true;
			}
			if (this.gen >= 6 || target.side !== pokemon.side) {
				for (const effectid of ['craftyshield', 'matblock', 'quickguard', 'wideguard']) {
					if (target.side.removeSideCondition(effectid)) broke = true;
				}
			}
			if (broke) {
				if (move.id === 'feint') {
					this.add('-activate', target, 'move: Feint');
				} else {
					this.add('-activate', target, 'move: ' + move.name, '[broken]');
				}
			}
		}

		if (move.stealsBoosts) {
			let boosts = {};
			let stolen = false;
			for (let statName in target.boosts) {
				let stage = target.boosts[statName];
				if (stage > 0) {
					boosts[statName] = stage;
					stolen = true;
				}
			}
			if (stolen) {
				this.attrLastMove('[still]');
				this.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
				this.boost(boosts, pokemon, pokemon);

				for (let statName in boosts) {
					boosts[statName] = 0;
				}
				target.setBoost(boosts);
				this.add('-anim', pokemon, "Spectral Thief", target);
			}
		}

		move.totalDamage = 0;
		/**@type {number | false} */
		let damage = 0;
		pokemon.lastDamage = 0;
		if (move.multihit) {
			let hits = move.multihit;
			if (Array.isArray(hits)) {
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5) {
					if (this.gen >= 5) {
						hits = this.sample([2, 2, 3, 3, 4, 5]);
					} else {
						hits = this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					}
				} else {
					hits = this.random(hits[0], hits[1] + 1);
				}
			}
			hits = Math.floor(hits);
			let nullDamage = true;
			/**@type {number | false} */
			let moveDamage;
			// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
			let isSleepUsable = move.sleepUsable || this.getMove(move.sourceEffect).sleepUsable;
			let i;
			for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
				if (pokemon.status === 'slp' && !isSleepUsable) break;

				if (move.multiaccuracy && i > 0) {
					accuracy = move.accuracy;
					if (accuracy !== true) {
						if (!move.ignoreAccuracy) {
							boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
							boost = this.clampIntRange(boosts['accuracy'], -6, 6);
							if (boost > 0) {
								accuracy *= boostTable[boost];
							} else {
								accuracy /= boostTable[-boost];
							}
						}
						if (!move.ignoreEvasion) {
							boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
							boost = this.clampIntRange(boosts['evasion'], -6, 6);
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
						// @ts-ignore
						if (accuracy !== true && !this.randomChance(accuracy, 100)) break;
					}
				}

				moveDamage = this.moveHit(target, pokemon, move);
				if (moveDamage === false) break;
				if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage = (moveDamage || 0);
				// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
				move.totalDamage += damage;
				if (move.mindBlownRecoil && i === 0) {
					this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.getEffect('Mind Blown'), true);
				}
				this.eachEvent('Update');
			}
			if (i === 0) return false;
			if (nullDamage) damage = false;
			this.add('-hitcount', target, i);
		} else {
			damage = this.moveHit(target, pokemon, move);
			move.totalDamage = damage;
		}

		if (move.recoil && move.totalDamage) {
			this.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, pokemon, 'recoil');
		}

		if (move.struggleRecoil) {
			// @ts-ignore
			this.directDamage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1), pokemon, pokemon, {id: 'strugglerecoil'});
		}

		if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

		if (move.ohko) this.add('-ohko');

		if (!damage && damage !== 0) return damage;

		this.eachEvent('Update');

		if (target && !move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
	moveHit: function (target, pokemon, move, moveData, isSecondary, isSelf) {
		let damage;
		move = this.getMoveCopy(move);

		// @ts-ignore
		if (!moveData) moveData = move;
		if (!moveData.flags) moveData.flags = {};
		/**@type {?boolean | number} */
		let hitResult = true;

		// TryHit events:
		//   STEP 1: we see if the move will succeed at all:
		//   - TryHit, TryHitSide, or TryHitField are run on the move,
		//     depending on move target (these events happen in useMove
		//     or tryMoveHit, not below)
		//   == primary hit line ==
		//   Everything after this only happens on the primary hit (not on
		//   secondary or self-hits)
		//   STEP 2: we see if anything blocks the move from hitting:
		//   - TryFieldHit is run on the target
		//   STEP 3: we see if anything blocks the move from hitting the target:
		//   - If the move's target is a pokemon, TryHit is run on that pokemon

		// Note:
		//   If the move target is `foeSide`:
		//     event target = pokemon 0 on the target side
		//   If the move target is `allySide` or `all`:
		//     event target = the move user
		//
		//   This is because events can't accept actual sides or fields as
		//   targets. Choosing these event targets ensures that the correct
		//   side or field is hit.
		//
		//   It is the `TryHitField` event handler's responsibility to never
		//   use `target`.
		//   It is the `TryFieldHit` event handler's responsibility to read
		//   move.target and react accordingly.
		//   An exception is `TryHitSide` as a single event (but not as a normal
		//   event), which is passed the target side.

		if (move.target === 'all' && !isSelf) {
			hitResult = this.singleEvent('TryHitField', moveData, {}, target, pokemon, move);
		} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
			hitResult = this.singleEvent('TryHitSide', moveData, {}, (target ? target.side : null), pokemon, move);
		} else if (target) {
			hitResult = this.singleEvent('TryHit', moveData, {}, target, pokemon, move);
		}
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (target && !isSecondary && !isSelf) {
			if (move.target !== 'all' && move.target !== 'allySide' && move.target !== 'foeSide') {
				hitResult = this.runEvent('TryPrimaryHit', target, pokemon, moveData);
				if (hitResult === 0) {
					// special Substitute flag
					hitResult = true;
					target = null;
				}
			}
		}
		if (target && isSecondary && !moveData.self) {
			hitResult = true;
		}
		if (!hitResult) {
			return false;
		}

		if (target) {
			/**@type {?boolean | number | undefined} */
			let didSomething = undefined;

			damage = this.getDamage(pokemon, target, moveData);

			// getDamage has several possible return values:
			//
			//   a number:
			//     means that much damage is dealt (0 damage still counts as dealing
			//     damage for the purposes of things like Static)
			//   false:
			//     gives error message: "But it failed!" and move ends
			//   null:
			//     the move ends, with no message (usually, a custom fail message
			//     was already output by an event handler)
			//   undefined:
			//     means no damage is dealt and the move continues
			//
			// basically, these values have the same meanings as they do for event
			// handlers.

			if (damage === false || damage === null) {
				if (damage === false && !isSecondary && !isSelf) {
					this.add('-fail', target);
				}
				this.debug('damage calculation interrupted');
				return false;
			}
			if (move.selfdestruct === 'ifHit') {
				this.faint(pokemon, pokemon, move);
			}
			if ((damage || damage === 0) && !target.fainted) {
				if (move.noFaint && damage >= target.hp) {
					damage = target.hp - 1;
				}
				damage = this.damage(damage, target, pokemon, move);
				if (!(damage || damage === 0)) {
					this.debug('damage interrupted');
					return false;
				}
				didSomething = true;
			}

			if (moveData.boosts && !target.fainted) {
				hitResult = this.boost(moveData.boosts, target, pokemon, move, isSecondary, isSelf);
				didSomething = didSomething || hitResult;
			}
			if (moveData.heal && !target.fainted) {
				let d = target.heal((this.gen < 5 ? Math.floor : Math.round)(target.maxhp * moveData.heal[0] / moveData.heal[1]));
				if (!d && d !== 0) {
					this.add('-fail', target);
					this.debug('heal interrupted');
					return false;
				}
				this.add('-heal', target, target.getHealth);
				didSomething = true;
			}
			if (moveData.status) {
				hitResult = target.trySetStatus(moveData.status, pokemon, moveData.ability ? moveData.ability : move);
				if (!hitResult && move.status) return hitResult;
				didSomething = didSomething || hitResult;
			}
			if (moveData.forceStatus) {
				hitResult = target.setStatus(moveData.forceStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.volatileStatus) {
				hitResult = target.addVolatile(moveData.volatileStatus, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.sideCondition) {
				hitResult = target.side.addSideCondition(moveData.sideCondition, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.weather) {
				hitResult = this.setWeather(moveData.weather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.terrain) {
				hitResult = this.setTerrain(moveData.terrain, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.pseudoWeather) {
				hitResult = this.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
				didSomething = didSomething || hitResult;
			}
			if (moveData.forceSwitch) {
				hitResult = this.canSwitch(target.side);
				didSomething = didSomething || hitResult;
			}
			if (moveData.selfSwitch) {
				// If the move is Parting Shot and it fails to change the target's stats in gen 7, didSomething will be null instead of undefined.
				// Leaving didSomething as null will cause this function to return before setting the switch flag, preventing the switch.
				if (this.canSwitch(pokemon.side) && (didSomething !== null || this.gen < 7)) {
					didSomething = true;
				} else {
					didSomething = didSomething || false;
				}
			}
			// Hit events
			//   These are like the TryHit events, except we don't need a FieldHit event.
			//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
			if (move.target === 'all' && !isSelf) {
				if (moveData.onHitField) {
					hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
					didSomething = didSomething || hitResult;
				}
			} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
				if (moveData.onHitSide) {
					hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
					didSomething = didSomething || hitResult;
				}
			} else {
				if (moveData.onHit) {
					hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
					didSomething = didSomething || hitResult;
				}
				if (!isSelf && !isSecondary) {
					this.runEvent('Hit', target, pokemon, move);
				}
				if (moveData.onAfterHit) {
					hitResult = this.singleEvent('AfterHit', moveData, {}, target, pokemon, move);
					didSomething = didSomething || hitResult;
				}
			}

			// Move didn't fail because it didn't try to do anything
			if (didSomething === undefined) didSomething = true;

			if (!didSomething && !moveData.self && !moveData.selfdestruct) {
				if (!isSelf && !isSecondary) {
					if (didSomething === false) this.add('-fail', pokemon);
				}
				this.debug('move failed because it did nothing');
				return false;
			}
		}
		if (moveData.self && !move.selfDropped) {
			let selfRoll;
			// @ts-ignore
			if (!isSecondary && moveData.self.boosts) {
				selfRoll = this.random(100);
				if (!move.multihit) move.selfDropped = true;
			}
			// This is done solely to mimic in-game RNG behaviour. All self drops have a 100% chance of happening but still grab a random number.
			// @ts-ignore
			if (typeof moveData.self.chance === 'undefined' || selfRoll < moveData.self.chance) {
				// @ts-ignore
				this.moveHit(pokemon, pokemon, move, moveData.self, isSecondary, true);
			}
		}
		if (moveData.secondaries) {
			let secondaryRoll;
			let secondaries = this.runEvent('ModifySecondaries', target, pokemon, moveData, moveData.secondaries.slice());
			for (const secondary of secondaries) {
				secondaryRoll = this.random(100);
				if (typeof secondary.chance === 'undefined' || secondaryRoll < secondary.chance) {
					this.moveHit(target, pokemon, move, secondary, true, isSelf);
				}
			}
		}
		if (target && target.hp > 0 && pokemon.hp > 0 && moveData.forceSwitch && this.canSwitch(target.side)) {
			hitResult = this.runEvent('DragOut', target, pokemon, move);
			if (hitResult) {
				target.forceSwitchFlag = true;
			} else if (hitResult === false && move.category === 'Status') {
				this.add('-fail', target);
				return false;
			}
		}
		if (move.selfSwitch && pokemon.hp) {
			pokemon.switchFlag = move.fullname;
		}
		return damage;
	},

	calcRecoilDamage: function (damageDealt, move) {
		// @ts-ignore
		return this.clampIntRange(Math.round(damageDealt * move.recoil[0] / move.recoil[1]), 1);
	},

	zMoveTable: {
		Poison: "Acid Downpour",
		Fighting: "All-Out Pummeling",
		Dark: "Black Hole Eclipse",
		Grass: "Bloom Doom",
		Normal: "Breakneck Blitz",
		Rock: "Continental Crush",
		Steel: "Corkscrew Crash",
		Dragon: "Devastating Drake",
		Electric: "Gigavolt Havoc",
		Water: "Hydro Vortex",
		Fire: "Inferno Overdrive",
		Ghost: "Never-Ending Nightmare",
		Bug: "Savage Spin-Out",
		Psychic: "Shattered Psyche",
		Ice: "Subzero Slammer",
		Flying: "Supersonic Skystrike",
		Ground: "Tectonic Rage",
		Fairy: "Twinkle Tackle",
	},

	getZMove: function (move, pokemon, skipChecks) {
		let item = pokemon.getItem();
		if (!skipChecks) {
			if (pokemon.side.zMoveUsed) return;
			if (!item.zMove) return;
			if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
			let moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (item.zMoveFrom) {
			if (move.name === item.zMoveFrom) return item.zMove;
		} else if (item.zMove === true) {
			if (move.type === item.zMoveType) {
				if (move.category === "Status") {
					return move.name;
				} else if (move.zMovePower) {
					return this.zMoveTable[move.type];
				}
			}
		}
	},

	getZMoveCopy: function (move, pokemon) {
		let zMove;
		if (pokemon) {
			let item = pokemon.getItem();
			if (move.name === item.zMoveFrom) {
				// @ts-ignore
				return this.getMoveCopy(item.zMove);
			}
		}

		if (move.category === 'Status') {
			zMove = this.getMoveCopy(move);
			zMove.isZ = true;
			return zMove;
		}
		zMove = this.getMoveCopy(this.zMoveTable[move.type]);
		// @ts-ignore
		zMove.basePower = move.zMovePower;
		zMove.category = move.category;
		return zMove;
	},

	canZMove: function (pokemon) {
		if (pokemon.side.zMoveUsed || (pokemon.transformed && (pokemon.template.isMega || pokemon.template.isPrimal || pokemon.template.forme === "Ultra"))) return;
		let item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
		let atLeastOne = false;
		/**@type {AnyObject?[]} */
		let zMoves = [];
		for (const moveSlot of pokemon.moveSlots) {
			if (moveSlot.pp <= 0) {
				zMoves.push(null);
				continue;
			}
			let move = this.getMove(moveSlot.move);
			let zMoveName = this.getZMove(move, pokemon, true) || '';
			if (zMoveName) {
				let zMove = this.getMove(zMoveName);
				if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
				zMoves.push({move: zMoveName, target: zMove.target});
			} else {
				zMoves.push(null);
			}
			if (zMoveName) atLeastOne = true;
		}
		if (atLeastOne) return zMoves;
	},

	canMegaEvo: function (pokemon) {
		let altForme = pokemon.baseTemplate.otherFormes && this.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		let item = pokemon.getItem();
		if (altForme && altForme.isMega && altForme.requiredMove && pokemon.baseMoves.includes(toId(altForme.requiredMove)) && !item.zMove) return altForme.species;
		if (item.megaEvolves !== pokemon.baseTemplate.baseSpecies || item.megaStone === pokemon.species) {
			return null;
		}
		return item.megaStone;
	},

	canUltraBurst: function (pokemon) {
		if (['Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane'].includes(pokemon.baseTemplate.species) &&
			pokemon.getItem().id === 'ultranecroziumz') {
			return "Necrozma-Ultra";
		}
		return null;
	},

	runMegaEvo: function (pokemon) {
		const templateid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!templateid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(templateid, pokemon.getItem(), true);

		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},

	isAdjacent: function (pokemon1, pokemon2) {
		if (pokemon1.fainted || pokemon2.fainted) return false;
		if (pokemon1.side === pokemon2.side) return Math.abs(pokemon1.position - pokemon2.position) === 1;
		return Math.abs(pokemon1.position + pokemon2.position + 1 - pokemon1.side.active.length) <= 1;
	},

	targetTypeChoices: function (targetType) {
		return CHOOSABLE_TARGETS.has(targetType);
	},
};

exports.BattleScripts = BattleScripts;
