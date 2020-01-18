'use strict';

/** @type {ModdedBattleScriptsData} */
let BattleScripts = {
	inherit: 'gen7',
	runMove(moveOrMoveName, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
		let target = this.getTarget(pokemon, zMove || moveOrMoveName, targetLoc);
		let baseMove = this.dex.getActiveMove(moveOrMoveName);
		const pranksterBoosted = baseMove.pranksterBoosted;
		if (!sourceEffect && baseMove.id !== 'struggle' && !zMove) {
			let changedMove = this.runEvent('OverrideAction', pokemon, target, baseMove);
			if (changedMove && changedMove !== true) {
				baseMove = this.dex.getActiveMove(changedMove);
				if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
				target = this.getRandomTarget(pokemon, baseMove);
			}
		}
		let move = zMove ? this.getActiveZMove(baseMove, pokemon) : baseMove;

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
					let gameConsole = [null, 'Game Boy', 'Game Boy Color', 'Game Boy Advance', 'DS', 'DS', '3DS', '3DS'][this.gen] || 'Switch';
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
		let noLock = externalMove && !pokemon.volatiles.lockedmove;

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			this.add('-zpower', pokemon);
			pokemon.m.zMoveUsed = true;
		}
		let moveDidSomething = this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
		if (this.activeMove) move = this.activeMove;
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);

		// Dancer's activation order is completely different from any other event, so it's handled separately
		if (move.flags['dance'] && moveDidSomething && !move.isExternal) {
			let dancers = [];
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
			dancers.sort((a, b) =>
				-(b.storedStats['spe'] - a.storedStats['spe']) || b.abilityOrder - a.abilityOrder
			);
			for (const dancer of dancers) {
				if (this.faintMessages()) break;
				this.add('-activate', dancer, 'ability: Dancer');
				this.runMove(move.id, dancer, 0, this.dex.getAbility('dancer'), undefined, true);
				// Using a Dancer move is enough to spoil Fake Out etc.
				dancer.activeTurns++;
			}
		}
		if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
	},
	// Modded to allow arrays as Mega Stone options
	canMegaEvo(pokemon) {
		let altForme = pokemon.baseTemplate.otherFormes && this.dex.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		let item = pokemon.getItem();
		if (altForme && altForme.isMega && altForme.requiredMove && pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) return altForme.species;
		if (item.megaEvolves !== pokemon.baseTemplate.species || (Array.isArray(item.megaStone) && item.megaStone.includes(pokemon.species)) || (typeof item.megaStone === 'string' && item.megaStone === pokemon.species)) {
			return null;
		}
		if (Array.isArray(item.megaStone)) {
			return item.megaStone[this.random(item.megaStone.length)];
		}
		return item.megaStone;
	},
	// Modded to allow unlimited mega evos
	runMegaEvo(pokemon) {
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

		// Limit mega evolution to once-per-Pokemon
		pokemon.canMegaEvo = null;

		this.runEvent('AfterMega', pokemon);

		// E4 flint gains fire type when mega evolving
		if (pokemon.name === 'E4 Flint' && !pokemon.illusion) this.add('-start', pokemon, 'typeadd', 'Fire');
		// Overneat gains the fairy type when mega evolving
		if (pokemon.name === 'Overneat' && !pokemon.illusion) this.add('-start', pokemon, 'typeadd', 'Fairy');

		return true;
	},
	getZMove(move, pokemon, skipChecks) {
		let item = pokemon.getItem();
		if (!skipChecks) {
			if (!item.zMove) return;
			if (item.itemUser && !item.itemUser.includes(pokemon.template.species)) return;
			let moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (item.zMoveFrom) {
			if (Array.isArray(item.zMoveFrom)) {
				if (item.zMoveFrom.includes(move.name)) return /** @type {string} */ (item.zMove);
			} else {
				if (move.name === item.zMoveFrom) return /** @type {string} */ (item.zMove);
			}
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
	getActiveZMove(move, pokemon) {
		let zMove;
		if (pokemon) {
			let item = pokemon.getItem();
			if (item.zMoveFrom && Array.isArray(item.zMoveFrom) ? item.zMoveFrom.includes(move.name) : item.zMoveFrom === move.name) {
				// @ts-ignore
				zMove = this.dex.getActiveMove(item.zMove);
				// @ts-ignore Hack for Snaquaza's Z move
				zMove.baseMove = move;
				zMove.isZPowered = true;
				return zMove;
			}
		}

		if (move.category === 'Status') {
			zMove = this.dex.getActiveMove(move);
			zMove.isZ = true;
			zMove.isZPowered = true;
			return zMove;
		}
		zMove = this.dex.getActiveMove(this.zMoveTable[move.type]);
		// @ts-ignore
		zMove.basePower = move.zMovePower;
		zMove.category = move.category;
		zMove.isZPowered = true;
		return zMove;
	},
	// Modded to allow each Pokemon on a team to use a Z move once per battle
	canZMove(pokemon) {
		if ((pokemon.m && pokemon.m.zMoveUsed) || (pokemon.transformed && (pokemon.template.isMega || pokemon.template.isPrimal || pokemon.template.forme === "Ultra"))) return;
		let item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.itemUser && !item.itemUser.includes(pokemon.template.species)) return;
		let atLeastOne = false;
		let mustStruggle = true;
		/**@type {ZMoveOptions} */
		let zMoves = [];
		for (const moveSlot of pokemon.moveSlots) {
			if (moveSlot.pp <= 0) {
				zMoves.push(null);
				continue;
			}
			if (!moveSlot.disabled) {
				mustStruggle = false;
			}
			let move = this.dex.getMove(moveSlot.move);
			let zMoveName = this.getZMove(move, pokemon, true) || '';
			if (zMoveName) {
				let zMove = this.dex.getMove(zMoveName);
				if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
				zMoves.push({move: zMoveName, target: zMove.target});
			} else {
				zMoves.push(null);
			}
			if (zMoveName) atLeastOne = true;
		}
		if (atLeastOne && !mustStruggle) return zMoves;
	},
	runZPower(move, pokemon) {
		const zPower = this.dex.getEffect('zpower');
		if (move.category !== 'Status') {
			this.attrLastMove('[zeffect]');
		} else if (move.zMoveBoost) {
			this.boost(move.zMoveBoost, pokemon, pokemon, zPower);
		} else {
			switch (move.zMoveEffect) {
			case 'heal':
				this.heal(pokemon.maxhp, pokemon, pokemon, zPower);
				break;
			case 'healhalf':
				// For DragonWhale
				this.heal(pokemon.baseMaxhp / 2, pokemon, pokemon, zPower);
				break;
			case 'healreplacement':
				move.self = {sideCondition: 'healreplacement'};
				break;
			case 'boostreplacement':
				// For nui
				move.self = {sideCondition: 'boostreplacement'};
				break;
			case 'clearnegativeboost':
				/** @type {{[k: string]: number}} */
				let boosts = {};
				for (let i in pokemon.boosts) {
					// @ts-ignore
					if (pokemon.boosts[i] < 0) {
						boosts[i] = 0;
					}
				}
				pokemon.setBoost(boosts);
				this.add('-clearnegativeboost', pokemon, '[zeffect]');
				break;
			case 'redirect':
				pokemon.addVolatile('followme', pokemon, zPower);
				break;
			case 'crit2':
				pokemon.addVolatile('focusenergy', pokemon, zPower);
				break;
			case 'curse':
				if (pokemon.hasType('Ghost')) {
					this.heal(pokemon.maxhp, pokemon, pokemon, zPower);
				} else {
					this.boost({atk: 1}, pokemon, pokemon, zPower);
				}
			}
		}
	},
	// Modded to account for guts clones
	modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
		const tr = this.trunc;
		if (!move.type) move.type = '???';
		const type = move.type;

		baseDamage += 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			const spreadModifier = move.spreadModifier || (this.gameType === 'free-for-all' ? 0.5 : 0.75);
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		// crit - not a modifier
		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) {
			baseDamage = tr(baseDamage * (move.critModifier || (this.gen >= 6 ? 1.5 : 2)));
		}

		// random factor - also not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		typeMod = this.dex.clampIntRange(typeMod, -6, 6);
		target.getMoveHitData(move).typeMod = typeMod;
		if (typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > typeMod; i--) {
				baseDamage = tr(baseDamage / 2);
			}
		}

		if (isCrit && !suppressMessages) this.add('-crit', target);

		if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts') && !pokemon.hasAbility('superguarda') && !pokemon.hasAbility('radioactive')) {
			if (this.gen < 6 || move.id !== 'facade') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
		}

		// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
		if (this.gen === 5 && !baseDamage) baseDamage = 1;

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if ((move.isZPowered || move.isMax) && target.getMoveHitData(move).zBrokeProtect) {
			baseDamage = this.modify(baseDamage, 0.25);
			this.add('-zbroken', target);
		}

		// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
		if (this.gen !== 5 && !baseDamage) return 1;

		// ...but 16-bit truncation happens even later, and can truncate to 0
		return tr(baseDamage, 16);
	},
	pokemon: {
		ignoringAbility() {
			const abilities = [
				'battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange',
			];
			// Neutralizing Spores modded into ignoringAbility
			let sporeEffect = false;
			for (const foeActive of this.side.foe.active) {
				// foeActive can be null when a pokemon isn't active
				if (foeActive && foeActive.ability.includes('neutralizingspores') && !foeActive.volatiles['gastroacid']) sporeEffect = true;
			}
			for (const allyActive of this.side.active) {
				// allyActive can be null when a pokemon isn't active
				if (allyActive && allyActive.ability.includes('neutralizingspores') && !allyActive.volatiles['gastroacid']) sporeEffect = true;
			}
			return !!((this.battle.gen >= 5 && !this.isActive) ||
					  (this.volatiles['gastroacid'] && !abilities.includes(this.ability)) ||
					  (sporeEffect && !this.ability.includes('neutralizingspores')));
		},
		getActionSpeed() {
			let speed = this.getStat('spe', false, false);
			if ((this.battle.field.getPseudoWeather('trickroom') || this.battle.field.getPseudoWeather('alienwave')) &&
				 !(this.battle.field.getPseudoWeather('trickroom') && this.battle.field.getPseudoWeather('alienwave'))) {
				speed = 0x2710 - speed;
			}
			if (this.battle.field.getPseudoWeather('distortionworld')) {
				speed = 0; // Anything times 0 is still 0
			}
			return this.battle.trunc(speed, 13);
		},
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
			// Innate levitate
			if ((('tony' in this.volatiles) && !this.illusion) && !this.battle.suppressingAttackEvents()) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
		setStatus(status, source = null, sourceEffect = null, ignoreImmunities = false) {
			if (!this.hp) return false;
			status = this.battle.dex.getEffect(status);
			if (this.battle.event) {
				if (!source) source = this.battle.event.source;
				if (!sourceEffect) sourceEffect = this.battle.effect;
			}
			if (!source) source = this;

			if (this.status === status.id) {
				if (sourceEffect && sourceEffect.status === this.status) {
					this.battle.add('-fail', this, this.status);
				} else if (sourceEffect && sourceEffect.status) {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}

			if (!ignoreImmunities && status.id &&
					!(source && source.hasAbility('corrosion') && ['tox', 'psn'].includes(status.id)) &&
					!(sourceEffect && sourceEffect.id === 'corrosivetoxic')) {
				// the game currently never ignores immunities
				if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
					this.battle.debug('immune to status');
					if (sourceEffect && sourceEffect.status) this.battle.add('-immune', this);
					return false;
				}
			}
			const prevStatus = this.status;
			const prevStatusData = this.statusData;
			if (status.id) {
				/** @type {boolean} */
				const result = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
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
};

exports.BattleScripts = BattleScripts;
