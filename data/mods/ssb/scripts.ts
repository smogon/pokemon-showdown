export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	// 1 mega per pokemon
	runMegaEvo(pokemon) {
		if (pokemon.name === 'Struchni' && pokemon.species.name === 'Aggron') pokemon.canMegaEvo = 'Aggron-Mega';
		if (pokemon.name === 'Raj.Shoot' && pokemon.species.name === 'Charizard') pokemon.canMegaEvo = 'Charizard-Mega-X';
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

		if (['Kaiju Bunny', 'Overneat', 'EpicNikolai'].includes(pokemon.name) && !pokemon.illusion) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'));
		}

		return true;
	},

	// Modded for Mega Rayquaza
	canMegaEvo(pokemon) {
		const species = pokemon.baseSpecies;
		const altForme = species.otherFormes && this.dex.getSpecies(species.otherFormes[0]);
		const item = pokemon.getItem();
		// Mega Rayquaza
		if (altForme?.isMega && altForme?.requiredMove &&
			pokemon.baseMoves.includes(this.toID(altForme.requiredMove)) && !item.zMove) {
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
			if (!moveData?.pp) return;
		}

		if (move.name === item.zMoveFrom) {
			return item.zMove as string;
		} else if (item.zMove === true && move.type === item.zMoveType) {
			if (move.category === "Status") {
				return move.name;
			} else if (move.zMove?.basePower) {
				return this.zMoveTable[move.type];
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
		const noLock = externalMove && !pokemon.volatiles['lockedmove'];

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
		if (noLock && pokemon.volatiles['lockedmove']) delete pokemon.volatiles['lockedmove'];
	},

	// For Jett's The Hunt is On!
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

		if (
			!move.negateSecondary &&
			!(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing'])) &&
			!this.getAllActive().some(x => x.hasAbility('skilldrain'))
		) {
			const originalHp = pokemon.hp;
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
			if (pokemon && pokemon !== target && move && move.category !== 'Status') {
				if (pokemon.hp <= pokemon.maxhp / 2 && originalHp > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		}

		if ((move.forceSwitch || move.selfSwitch) && this.getAllActive().some(x => x.hasAbility('skilldrain'))) {
			this.hint(`Self-switching and force switch moves don't trigger when a Pokemon with Skill Drain is active.`);
		}

		return true;
	},
	afterMoveSecondaryEvent(targets, pokemon, move) {
		// console.log(`${targets}, ${pokemon}, ${move}`)
		if (
			!move.negateSecondary &&
			!(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing'])) &&
			!this.getAllActive().some(x => x.hasAbility('skilldrain'))
		) {
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
						const boosts = this.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
						const boost = this.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) {
							accuracy *= boostTable[boost];
						} else {
							accuracy /= boostTable[-boost];
						}
					}
					if (!move.ignoreEvasion) {
						const boosts = this.runEvent('ModifyBoost', target, null, null, {...target.boosts});
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

		if (
			!move.negateSecondary &&
			!(move.hasSheerForce && pokemon.hasAbility(['sheerforce', 'aquilasblessing'])) &&
			!this.getAllActive().some(x => x.hasAbility('skilldrain'))
		) {
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

	// For Spandan's custom move and Brandon's ability
	getDamage(pokemon, target, move, suppressMessages = false) {
		if (typeof move === 'string') move = this.dex.getActiveMove(move);

		if (typeof move === 'number') {
			const basePower = move;
			move = new Dex.Move({
				basePower,
				type: '???',
				category: 'Physical',
				willCrit: false,
			}) as unknown as ActiveMove;
			move.hit = 0;
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) return target.maxhp;
		if (move.damageCallback) return move.damageCallback.call(this, pokemon, target);
		if (move.damage === 'level') {
			return pokemon.level;
		} else if (move.damage) {
			return move.damage;
		}

		const category = this.getCategory(move);
		const defensiveCategory = move.defensiveCategory || category;

		let basePower: number | false | null = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) return basePower === 0 ? undefined : basePower;
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			if (this.gen === 6) {
				critMult = [0, 16, 8, 2, 1];
			} else {
				critMult = [0, 24, 8, 2, 1];
			}
		}

		const moveHit = target.getMoveHitData(move);
		moveHit.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				moveHit.crit = this.randomChance(1, critMult[critRatio]);
			}
		}

		if (moveHit.crit) {
			moveHit.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		const level = pokemon.level;

		const attacker = pokemon;
		const defender = target;
		let attackStat: StatNameExceptHP = category === 'Physical' ? 'atk' : 'spa';
		const defenseStat: StatNameExceptHP = defensiveCategory === 'Physical' ? 'def' : 'spd';
		if (this.field.isTerrain('baneterrain')) {
			if (attacker.getStat('atk') > attacker.getStat('spa')) {
				attackStat = 'spa';
			} else {
				attackStat = 'atk';
			}
		}
		if (move.useSourceDefensiveAsOffensive) {
			attackStat = defenseStat;
			// Body press really wants to use the def stat,
			// so it switches stats to compensate for Wonder Room.
			// Of course, the game thus miscalculates the boosts...
			if ('wonderroom' in this.field.pseudoWeather) {
				if (attackStat === 'def') {
					attackStat = 'spd';
				} else if (attackStat === 'spd') {
					attackStat = 'def';
				}
				if (attacker.boosts['def'] || attacker.boosts['spd']) {
					this.hint("Body Press uses Sp. Def boosts when Wonder Room is active.");
				}
			}
		}

		const statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		let attack;
		let defense;

		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		if (move.id === 'imtoxicyoureslippinunder') atkBoosts = defender.boosts['spd'];
		let defBoosts = defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (moveHit.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

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
		} else if (move.id === 'imtoxicyoureslippinunder') {
			attack = defender.calculateStat("spd", atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		attackStat = (category === 'Physical' ? 'atk' : 'spa');
		defense = defender.calculateStat(defenseStat, defBoosts);

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		if (this.gen <= 4 && ['explosion', 'selfdestruct'].includes(move.id) && defenseStat === 'def') {
			defense = this.clampIntRange(Math.floor(defense / 2), 1);
		}

		const tr = this.trunc;

		// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * attack) / defense) / 50);

		// Calculate damage modifiers separately (order differs between generations)
		return this.modifyDamage(baseDamage, pokemon, target, move, suppressMessages);
	},

	runMoveEffects(damage, targets, pokemon, move, moveData, isSecondary, isSelf) {
		let didAnything: number | boolean | null | undefined = damage.reduce(this.combineResults);
		for (const [i, target] of targets.entries()) {
			if (target === false) continue;
			let hitResult;
			let didSomething: number | boolean | null | undefined = undefined;

			if (target) {
				if (moveData.boosts && !target.fainted) {
					hitResult = this.boost(moveData.boosts, target, pokemon, move, isSecondary, isSelf);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.heal && !target.fainted) {
					if (target.hp >= target.maxhp) {
						this.add('-fail', target, 'heal');
						this.attrLastMove('[still]');
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					const amount = target.baseMaxhp * moveData.heal[0] / moveData.heal[1];
					const d = target.heal((this.gen < 5 ? Math.floor : Math.round)(amount));
					if (!d && d !== 0) {
						this.add('-fail', pokemon);
						this.attrLastMove('[still]');
						this.debug('heal interrupted');
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					this.add('-heal', target, target.getHealth);
					didSomething = true;
				}
				if (moveData.status) {
					hitResult = target.trySetStatus(moveData.status, pokemon, moveData.ability ? moveData.ability : move);
					if (!hitResult && move.status) {
						damage[i] = this.combineResults(damage[i], false);
						didAnything = this.combineResults(didAnything, null);
						continue;
					}
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.forceStatus) {
					hitResult = target.setStatus(moveData.forceStatus, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.volatileStatus) {
					hitResult = target.addVolatile(moveData.volatileStatus, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.sideCondition) {
					hitResult = target.side.addSideCondition(moveData.sideCondition, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.slotCondition) {
					hitResult = target.side.addSlotCondition(target, moveData.slotCondition, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.weather) {
					hitResult = this.field.setWeather(moveData.weather, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.terrain) {
					hitResult = this.field.setTerrain(moveData.terrain, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.pseudoWeather) {
					hitResult = this.field.addPseudoWeather(moveData.pseudoWeather, pokemon, move);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				if (moveData.forceSwitch && !this.getAllActive().some(x => x.hasAbility('skilldrain'))) {
					hitResult = !!this.canSwitch(target.side);
					didSomething = this.combineResults(didSomething, hitResult);
				}
				// Hit events
				//   These are like the TryHit events, except we don't need a FieldHit event.
				//   Scroll up for the TryHit event documentation, and just ignore the "Try" part. ;)
				if (move.target === 'all' && !isSelf) {
					if (moveData.onHitField) {
						hitResult = this.singleEvent('HitField', moveData, {}, target, pokemon, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
				} else if ((move.target === 'foeSide' || move.target === 'allySide') && !isSelf) {
					if (moveData.onHitSide) {
						hitResult = this.singleEvent('HitSide', moveData, {}, target.side, pokemon, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
				} else {
					if (moveData.onHit) {
						hitResult = this.singleEvent('Hit', moveData, {}, target, pokemon, move);
						didSomething = this.combineResults(didSomething, hitResult);
					}
					if (!isSelf && !isSecondary) {
						this.runEvent('Hit', target, pokemon, move);
					}
				}
			}
			if (moveData.selfSwitch && !this.getAllActive().some(x => x.hasAbility('skilldrain'))) {
				if (this.canSwitch(pokemon.side)) {
					didSomething = true;
				} else {
					didSomething = this.combineResults(didSomething, false);
				}
			}
			// Move didn't fail because it didn't try to do anything
			if (didSomething === undefined) didSomething = true;
			damage[i] = this.combineResults(damage[i], didSomething === null ? false : didSomething);
			didAnything = this.combineResults(didAnything, didSomething);
		}


		if (!didAnything && didAnything !== 0 && !moveData.self && !moveData.selfdestruct) {
			if (!isSelf && !isSecondary) {
				if (didAnything === false) {
					this.add('-fail', pokemon);
					this.attrLastMove('[still]');
				}
			}
			this.debug('move failed because it did nothing');
		} else if (move.selfSwitch && pokemon.hp && !this.getAllActive().some(x => x.hasAbility('skilldrain'))) {
			pokemon.switchFlag = move.id;
		}

		return damage;
	},

	pokemon: {
		isGrounded(negateImmunity) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (this.hasAbility(['levitate', 'candlewax']) && !this.battle.suppressingAttackEvents()) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
		setStatus(status, source, sourceEffect, ignoreImmunities) {
			if (!this.hp) return false;
			status = this.battle.dex.getEffect(status);
			if (this.battle.event) {
				if (!source) source = this.battle.event.source;
				if (!sourceEffect) sourceEffect = this.battle.effect;
			}
			if (!source) source = this;

			if (this.status === status.id) {
				if ((sourceEffect as Move)?.status === this.status) {
					this.battle.add('-fail', this, this.status);
				} else if ((sourceEffect as Move)?.status) {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}

			if (!ignoreImmunities && status.id &&
					!((source?.hasAbility('corrosion') || source?.hasAbility('hackedcorrosion') || sourceEffect?.id === 'cradilychaos') &&
					['tox', 'psn'].includes(status.id))) {
				// the game currently never ignores immunities
				if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
					this.battle.debug('immune to status');
					if ((sourceEffect as Move)?.status) {
						this.battle.add('-immune', this);
					}
					return false;
				}
			}
			const prevStatus = this.status;
			const prevStatusData = this.statusData;
			if (status.id) {
				const result: boolean = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
				if (!result) {
					this.battle.debug('set status [' + status.id + '] interrupted');
					return result;
				}
			}

			this.status = status.id;
			this.statusData = {id: status.id, target: this};
			if (source) this.statusData.source = source;
			if (status.duration) this.statusData.duration = status.duration;
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
		},
	},

	// Modded to add a property to work with Struchni's move
	nextTurn() {
		this.turn++;
		this.lastSuccessfulMoveThisTurn = null;

		const trappedBySide: boolean[] = [];
		const stalenessBySide: ('internal' | 'external' | undefined)[] = [];
		for (const side of this.sides) {
			let sideTrapped = true;
			let sideStaleness: 'internal' | 'external' | undefined;
			for (const pokemon of side.active) {
				if (!pokemon) continue;
				pokemon.moveThisTurn = '';
				pokemon.newlySwitched = false;
				pokemon.moveLastTurnResult = pokemon.moveThisTurnResult;
				pokemon.moveThisTurnResult = undefined;
				if (this.turn !== 1) {
					pokemon.usedItemThisTurn = false;
					// Used for Veto
					pokemon.m.statsRaisedLastTurn = !!pokemon.statsRaisedThisTurn;
					pokemon.statsRaisedThisTurn = false;
					pokemon.statsLoweredThisTurn = false;
					// It shouldn't be possible in a normal battle for a Pokemon to be damaged before turn 1's move selection
					// However, this could be potentially relevant in certain OMs
					pokemon.hurtThisTurn = null;
				}

				pokemon.maybeDisabled = false;
				for (const moveSlot of pokemon.moveSlots) {
					moveSlot.disabled = false;
					moveSlot.disabledSource = '';
				}
				this.runEvent('DisableMove', pokemon);
				if (!pokemon.ateBerry) pokemon.disableMove('belch');
				if (!pokemon.getItem().isBerry) pokemon.disableMove('stuffcheeks');

				// If it was an illusion, it's not any more
				if (pokemon.getLastAttackedBy() && this.gen >= 7) pokemon.knownType = true;

				for (let i = pokemon.attackedBy.length - 1; i >= 0; i--) {
					const attack = pokemon.attackedBy[i];
					if (attack.source.isActive) {
						attack.thisTurn = false;
					} else {
						pokemon.attackedBy.splice(pokemon.attackedBy.indexOf(attack), 1);
					}
				}

				if (this.gen >= 7) {
					// In Gen 7, the real type of every Pokemon is visible to all players via the bottom screen while making choices
					const seenPokemon = pokemon.illusion || pokemon;
					const realTypeString = seenPokemon.getTypes(true).join('/');
					if (realTypeString !== seenPokemon.apparentType) {
						this.add('-start', pokemon, 'typechange', realTypeString, '[silent]');
						seenPokemon.apparentType = realTypeString;
						if (pokemon.addedType) {
							// The typechange message removes the added type, so put it back
							this.add('-start', pokemon, 'typeadd', pokemon.addedType, '[silent]');
						}
					}
				}

				pokemon.trapped = pokemon.maybeTrapped = false;
				this.runEvent('TrapPokemon', pokemon);
				if (!pokemon.knownType || this.dex.getImmunity('trapped', pokemon)) {
					this.runEvent('MaybeTrapPokemon', pokemon);
				}
				// canceling switches would leak information
				// if a foe might have a trapping ability
				if (this.gen > 2) {
					for (const source of pokemon.side.foe.active) {
						if (!source || source.fainted) continue;
						const species = (source.illusion || source).species;
						if (!species.abilities) continue;
						for (const abilitySlot in species.abilities) {
							const abilityName = species.abilities[abilitySlot as keyof Species['abilities']];
							if (abilityName === source.ability) {
								// pokemon event was already run above so we don't need
								// to run it again.
								continue;
							}
							const ruleTable = this.ruleTable;
							if ((ruleTable.has('+hackmons') || !ruleTable.has('obtainableabilities')) && !this.format.team) {
								// hackmons format
								continue;
							} else if (abilitySlot === 'H' && species.unreleasedHidden) {
								// unreleased hidden ability
								continue;
							}
							const ability = this.dex.getAbility(abilityName);
							if (ruleTable.has('-ability:' + ability.id)) continue;
							if (pokemon.knownType && !this.dex.getImmunity('trapped', pokemon)) continue;
							this.singleEvent('FoeMaybeTrapPokemon', ability, {}, pokemon, source);
						}
					}
				}

				if (pokemon.fainted) continue;

				sideTrapped = sideTrapped && pokemon.trapped;
				const staleness = pokemon.volatileStaleness || pokemon.staleness;
				if (staleness) sideStaleness = sideStaleness === 'external' ? sideStaleness : staleness;
				pokemon.activeTurns++;
			}
			trappedBySide.push(sideTrapped);
			stalenessBySide.push(sideStaleness);
			side.faintedLastTurn = side.faintedThisTurn;
			side.faintedThisTurn = null;
		}

		if (this.maybeTriggerEndlessBattleClause(trappedBySide, stalenessBySide)) return;

		if (this.gameType === 'triples' && !this.sides.filter(side => side.pokemonLeft > 1).length) {
			// If both sides have one Pokemon left in triples and they are not adjacent, they are both moved to the center.
			const actives = this.getAllActive();
			if (actives.length > 1 && !this.isAdjacent(actives[0], actives[1])) {
				this.swapPosition(actives[0], 1, '[silent]');
				this.swapPosition(actives[1], 1, '[silent]');
				this.add('-center');
			}
		}

		this.add('turn', this.turn);

		this.makeRequest('move');
	},
};
