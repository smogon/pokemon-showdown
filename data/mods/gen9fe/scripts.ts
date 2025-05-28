export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		inherit: true,
		terastallize(pokemon: Pokemon) {
			if (pokemon.illusion && ['Hattepon', 'Ogerpon', 'Terapagos'].includes(pokemon.illusion.species.baseSpecies)) {
				this.battle.singleEvent('End', this.dex.abilities.get('Rough Image'), pokemon.abilityState, pokemon);
			}
			const type = pokemon.teraType;
			this.battle.add('-terastallize', pokemon, type);
			pokemon.terastallized = type;
			for (const ally of pokemon.side.pokemon) {
				ally.canTerastallize = null;
			}
			pokemon.addedType = '';
			pokemon.knownType = true;
			pokemon.apparentType = type;
			pokemon.side.addSideCondition('teraused', pokemon);
			if (['Ogerpon', 'Hattepon'].includes(pokemon.species.baseSpecies)) {
				const tera = ['ogerpon', 'hattepon'].includes(pokemon.species.id) ? 'tealtera' : 'tera';
				pokemon.formeChange(pokemon.species.id + tera, null, true);
			}
			this.battle.runEvent('AfterTerastallization', pokemon);
		},
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			if (
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.dex.toID(altForme.requiredMove)) && !item.zMove
			) {
				return altForme.name;
			}
			if (item.megaStone === species.name) return null;
			switch (species.name) {
			case "Chomptry":
				if (item.name === "Garchompite") {
					return "Chomptry-Mega";
				}
				return null;
			case "Tentazor":
				if (item.name === "Scizorite") {
					return "Tentazor-Mega";
				}
				return null;
			case "Aerodirge":
				if (item.name === "Aerodactylite") {
					return "Aerodirge-Mega";
				}
				return null;
			}
			if (item.megaEvolves === species.baseSpecies) {
				return item.megaStone;
			}
			return null;
		},
		canUltraBurst(pokemon) {
			if (pokemon.baseSpecies.name === 'Necrotrik-Dawn-Wings' && pokemon.getItem().id === 'depletedultranecroziumz') {
				return "Necrotrik-Ultra";
			}
			return null;
		},
		hitStepTryImmunity(targets, pokemon, move) {
			const hitResults = [];
			for (const [i, target] of targets.entries()) {
				if (move.flags['powder'] && target !== pokemon && !this.dex.getImmunity('powder', target)) {
					this.battle.debug('natural powder immunity');
				} else if (this.battle.singleEvent('TryImmunity', move, {}, target, pokemon, move)) {
					if (move.pranksterBoosted && !this.dex.getImmunity('prankster', target) &&
						pokemon.hasAbility(['prankster', 'openingact', 'prankrock']) &&
						!targets[i].isAlly(pokemon)) {
						this.battle.debug('natural prankster immunity');
						if (!target.illusion) this.battle.hint("Since gen 7, Dark is immune to Prankster moves.");
					} else {
						hitResults[i] = true;
						continue;
					}
				}
				this.battle.add('-immune', target);
				hitResults[i] = false;
			}
			return hitResults;
		},
		runMove(
			moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number,
			options?: {
				sourceEffect?: Effect | null, zMove?: string, externalMove?: boolean,
				maxMove?: string, originalTarget?: Pokemon,
			}
		) {
			pokemon.activeMoveActions++;
			const zMove = options?.zMove;
			const maxMove = options?.maxMove;
			const externalMove = options?.externalMove;
			const originalTarget = options?.originalTarget;
			let sourceEffect = options?.sourceEffect;
			let target = this.battle.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
			let baseMove = this.dex.getActiveMove(moveOrMoveName);
			const priority = baseMove.priority;
			const pranksterBoosted = baseMove.pranksterBoosted;
			if (baseMove.id !== 'struggle' && !zMove && !maxMove && !externalMove) {
				const changedMove = this.battle.runEvent('OverrideAction', pokemon, target, baseMove);
				if (changedMove && changedMove !== true) {
					baseMove = this.dex.getActiveMove(changedMove);
					baseMove.priority = priority;
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
			// Used exclusively for a hint later
			if (move.flags['cantusetwice'] && pokemon.lastMove?.id === move.id) {
				pokemon.addVolatile(move.id);
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
					this.battle.singleEvent('End', this.dex.abilities.get('Rough Image'), pokemon.abilityState, pokemon);
				}
				this.battle.add('-zpower', pokemon);
				pokemon.side.zMoveUsed = true;
			}
			const oldActiveMove = move;
			const moveDidSomething = this.useMove(baseMove, pokemon, { target, sourceEffect, zMove, maxMove });
			this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
			if (this.battle.activeMove) move = this.battle.activeMove;
			this.battle.singleEvent('AfterMove', move, null, pokemon, target, move);
			this.battle.runEvent('AfterMove', pokemon, target, move);
			if (move.flags['cantusetwice'] && pokemon.removeVolatile(move.id)) {
				this.battle.add('-hint', `Some effects can force a Pokemon to use ${move.name} again in a row.`);
			}
			// TODO: Refactor to use BattleQueue#prioritizeAction in onAnyAfterMove handlers
			// Dancer's activation order is completely different from any other event, so it's handled separately
			if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
				const dancers = [];
				for (const currentPoke of this.battle.getAllActive()) {
					if (pokemon === currentPoke) continue;
					if (currentPoke.hasAbility('choreography') && !currentPoke.isSemiInvulnerable()) {
						dancers.push(currentPoke);
					}
				}
				// Dancer activates in order of lowest speed stat to highest
				// Note that the speed stat used is after any volatile replacements like Speed Swap,
				// but before any multipliers like Agility or Choice Scarf
				// Ties go to whichever Pokemon has had the ability for the least amount of time
				dancers.sort(
					(a, b) => -(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityState.effectOrder - a.abilityState.effectOrder
				);
				const targetOf1stDance = this.battle.activeTarget!;
				for (const dancer of dancers) {
					if (this.battle.faintMessages()) break;
					if (dancer.fainted) continue;
					this.battle.add('-activate', dancer, 'ability: Choreography');
					const dancersTarget = !targetOf1stDance.isAlly(dancer) && pokemon.isAlly(dancer) ?
						targetOf1stDance :
						pokemon;
					const dancersTargetLoc = dancer.getLocOf(dancersTarget);
					this.runMove(
						move.id, dancer, dancersTargetLoc, { sourceEffect: this.dex.abilities.get('choreography'), externalMove: true }
					);
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
		useMoveInner(
			moveOrMoveName: Move | string, pokemon: Pokemon, options?: {
				target?: Pokemon | null, sourceEffect?: Effect | null,
				zMove?: string, maxMove?: string,
			},
		) {
			let target = options?.target;
			let sourceEffect = options?.sourceEffect;
			const zMove = options?.zMove;
			const maxMove = options?.maxMove;
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
			let targetRelayVar = { target };
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
			if (sourceEffect) attrs += `|[from] ${sourceEffect.fullname}`;
			if (zMove && move.isZ === true) {
				attrs = `|[anim]${movename}${attrs}`;
				movename = `Z-${movename}`;
			}
			this.battle.addMove('move', pokemon, movename, `${target}${attrs}`);
			if (zMove) this.runZPower(move, pokemon);
			if (!target) {
				this.battle.attrLastMove('[notarget]');
				this.battle.add(this.battle.gen >= 5 ? '-fail' : '-notarget', pokemon);
				return false;
			}
			const { targets, pressureTargets } = pokemon.getMoveTargets(move, target);
			if (targets.length) {
				target = targets[targets.length - 1]; // in case of redirection
			}
			const callerMoveForPressure = sourceEffect && (sourceEffect as ActiveMove).pp ? sourceEffect as ActiveMove : null;
			if (!sourceEffect || callerMoveForPressure || sourceEffect.id === 'pursuit') {
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
				!(move.hasSheerForce &&
					pokemon.hasAbility(['sheerforce', 'forceofnature', 'sandwrath', 'overwhelming', 'powerbuns'])) &&
					!move.flags['futuremove']
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
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;
			baseDamage += 2;
			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			}
			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);
			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}
			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);
			// STAB
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			if (type !== '???') {
				let stab: number | [number, number] = 1;
				const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
				if (isSTAB) {
					stab = 1.5;
				}
				// The Stellar tera type makes this incredibly confusing
				// If the move's type does not match one of the user's base types,
				// the Stellar tera type applies a one-time 1.2x damage boost for that type.
				// If the move's type does match one of the user's base types,
				// then the Stellar tera type applies a one-time 2x STAB boost for that type,
				// and then goes back to using the regular 1.5x STAB boost for those types.
				if (pokemon.terastallized === 'Stellar') {
					if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
						stab = isSTAB ? 2 : [4915, 4096];
						move.stellarBoosted = true;
						if (pokemon.species.name !== 'Terapagos-Stellar') {
							pokemon.stellarBoostedTypes.push(type);
						}
					}
				} else {
					if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
						stab = 2;
					}
					stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
				}
				baseDamage = this.battle.modify(baseDamage, stab);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);
				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);
				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}
			if (isCrit && !suppressMessages) this.battle.add('-crit', target);
			if (pokemon.status === 'brn' && move.category === 'Physical' &&
				!pokemon.hasAbility(['wellbakedflameorb', 'feistytempo', 'guts', 'adrenalinearoma'])) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}
			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;
			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);
			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}
			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;
			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},

		/* secondaries(targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove, moveData: ActiveMove, isSelf?: boolean) {
			if (!moveData.secondaries) return;
			for (const foe of targets) {
				if (foe === false) continue;
				const secondaries: Dex.SecondaryEffect[] =
					this.battle.runEvent('ModifySecondaries', foe, source, moveData, moveData.secondaries.slice());
				for (const secondary of secondaries) {
					const secondaryRoll = this.battle.random(100);
					// User stat boosts or foe stat drops can possibly overflow if it goes beyond 256 in Gen 8 or prior
					const secondaryOverflow = (secondary.boosts || secondary.self) && this.battle.gen <= 8;
					if (typeof secondary.chance === 'undefined' ||
						secondaryRoll < (secondaryOverflow ? secondary.chance % 256 : secondary.chance)) {
						let flag = true;
						if (moveData.secondary?.status && foe) flag = foe.setStatus(moveData.secondary.status, source);
						if (moveData.secondary?.volatileStatus && foe) flag = !(moveData.secondary.volatileStatus in foe.volatiles);
						if (moveData.secondary?.volatileStatus === 'flinch' && foe) flag = flag && foe.activeTurns >= 1 && !foe.moveThisTurn;
						this.moveHit(foe, source, move, secondary, true, isSelf);
						if (moveData.secondary?.self?.boosts) {
							Object.entries(moveData.secondary.self.boosts).forEach(([stat, boost]) => {
								if (source.boosts[stat as BoostID] === 6) flag = false;
							});
						} else {
							if (foe) flag = flag && !(foe.hp === undefined || foe.hp <= 0);
						}
						if (moveData.target !== 'self' && moveData.secondary?.boosts && foe) {
							const cantLower = {
								'atk': ['clearbody', 'fullmetalbody', 'hypercutter', 'whitesmoke'],
								'def': ['bigpecks', 'clearbody', 'fullmetalbody', 'whitesmoke'],
								'spa': ['clearbody', 'fullmetalbody', 'whitesmoke'],
								'spd': ['clearbody', 'fullmetalbody', 'whitesmoke'],
								'spe': ['clearbody', 'fullmetalbody', 'whitesmoke'],
								'accuracy': ['clearbody', 'fullmetalbody', 'keeneye', 'whitesmoke'],
								'evasion': [] };
							for (const k in moveData.secondary.boosts) {
								if (foe.boosts[k as BoostID] === -6) {
									flag = false;
									continue;
								}
								if (foe.hasAbility(cantLower[k as BoostID]) && !move.ignoreAbility) {
									flag = false;
									break;
								}
							}
						}
						if (source.hasAbility('sheerforce')) flag = false;
						if (foe && foe.hasAbility('shielddust') && !move.ignoreAbility &&
							move.secondary && !move.secondary.self?.boosts) {
							flag = false;
						}
						if (flag && foe && foe.hasAbility('serenesync') && move.secondary && secondary.chance) {
							this.battle.add('-activate', foe, 'ability: Serene Sync');
							move.secondary.self = move.secondary;
						}
					}
				}
			}
		}, */
	},
	pokemon: {
		runImmunity(type: string, message?: string | boolean) {
			if (!type || type === '???') return true;
			if (!this.battle.dex.types.isName(type)) {
				throw new Error("Use runStatusImmunity for " + type);
			}
			if (this.fainted) return false;
			const negateImmunity = !this.battle.runEvent('NegateImmunity', this, type);
			const notImmune = type === 'Ground' ?
				this.isGrounded(negateImmunity) :
				negateImmunity || this.battle.dex.getImmunity(type, this);
			if (notImmune) return true;
			if (message) {
				if (notImmune === null) {
					this.battle.add('-immune', this, '[from] ability: ' + this.getAbility().name);
				} else {
					this.battle.add('-immune', this);
				}
			}
			return false;
		},
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather || 'ingrain' in this.volatiles ||
				'smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (
				(this.hasAbility([
					'levitate', 'holygrail', 'risingtension', 'freeflight', 'airbornearmor', 'hellkite', 'honeymoon',
					'aircontrol', 'magnetize', 'unidentifiedflyingobject', 'anointed',
				])) &&
				!this.battle.suppressingAbility(this)
			) return null;
			if ('magnetrise' in this.volatiles || 'telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
	},
};
