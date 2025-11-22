import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import {
	calculateTotalExpForLevel,
	calculateStats,
	getMove,
	levelUp,
	handleLearningMoves,
	checkEvolution,
	NATURES,
	type CheckEvolutionContext,
	getActiveSlots,
	getActiveParty,
	TYPE_CHART,
	INITIAL_STAT_STAGES,
	applyStatChange,
	checkStatDropAbilities,
	activateUnburden,
	applySynchronize,
	handleHPDropEffects,
	consumeBerry,
	handleMirrorHerb,
	handleLeppaBerry,
	setItem,
	getAccuracyEvasionMultiplier,
} from './utils';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState, Stats, Move, AbilityContext } from './interface';
import { BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES, TYPE_RESIST_BERRIES, ITEMS_DATABASE, ITEM_PRICES } from './items';
import { getPlayerData, activeBattles, playerData } from './core';
import { GameConfig } from './game-config';
import {
	generateBattleHTML,
	generateMoveLearnHTML,
	generatePivotSwitchHTML,
	generateFaintSwitchHTML,
} from './html';
import { MANUAL_CATCH_RATES, MANUAL_BASE_EXP, MANUAL_EV_YIELDS } from './data-exp-evs-catch-rates';
import { RPGMoves } from './battle-moves';

/**
 * Checks if a move hits the target based on accuracy and evasion.
 * Returns true if hit, false if miss.
 */
export function checkAccuracy(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	// Always Hit Moves
	if (move.id === 'aerialace' || move.id === 'struggle' || move.id === 'swift' || move.id === 'magicalleaf' || move.id === 'shockwave') {
		return true;
	}

	// Toxic hits automatically if user is Poison type (Gen 6+)
	if (move.id === 'toxic') {
		const attackerSpecies = Dex.species.get(attacker.species);
		if (attackerSpecies.types.includes('Poison')) {
			return true;
		}
	}

	// No Guard Ability
	const attackerAbility = toID(attacker.ability || '');
	const defenderAbility = RPGAbilities.getActiveAbility(defender, attacker);
	if (attackerAbility === 'noguard' || defenderAbility === 'noguard') {
		return true;
	}

	// Standard Accuracy Check
	if (move.accuracy === true) return true; // moves with accuracy: true always hit (e.g. self-target)

	const moveAccuracyBase = typeof move.accuracy === 'number' ? move.accuracy : 100;
	
	let accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
	const ignoresEvasion = attackerAbility === 'mindseye' || move.ignoreEvasion;
	const evasionMultiplier = ignoresEvasion ? 1 : getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
	
	let moveAccuracy = RPGAbilities.applyAccuracyModifier(moveAccuracyBase, attacker, move);

	const abilityEvasionMultiplier = RPGAbilities.getEvasionMultiplier(defenderSlot, battle);
	const finalEvasionMultiplier = evasionMultiplier * abilityEvasionMultiplier;

	// Weather Modifiers
	if (RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather!.type.includes('rain')) {
			if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
		} else if (battle.weather!.type.includes('sun')) {
			if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 50;
		}
		if (battle.weather!.type === 'hail' && move.id === 'blizzard') moveAccuracy = 100;
	}

	// Gravity Modifier
	if (battle.gravityTurns > 0) moveAccuracy = Math.floor(moveAccuracy * (5 / 3));

	// Item Modifiers
	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'widelens') {
			moveAccuracy = Math.floor(moveAccuracy * 1.1);
		}
		if (attacker.item === 'zoomlens') {
			const attSpeed = attacker.spe * getStatMultiplier(attackerSlot.statStages.spe);
			const defSpeed = defender.spe * getStatMultiplier(defenderSlot.statStages.spe);
			if (attSpeed < defSpeed) {
				moveAccuracy = Math.floor(moveAccuracy * 1.2);
			}
		}
		if (defender.item === 'brightpowder' || defender.item === 'laxincense') {
			moveAccuracy = Math.floor(moveAccuracy * 0.9);
		}
	}

	const finalAccuracy = moveAccuracy * (accuracyMultiplier / finalEvasionMultiplier);
	
	if ((Math.random() * 100) > finalAccuracy) {
		messageLog.push(`<span style="color: #dc3545;">${attacker.species}'s ${move.name} missed ${defender.species}!</span>`);
		
		// Crash effects on miss
		if (['highjumpkick', 'jumpkick'].includes(move.id)) {
			const crashDamage = Math.floor(attacker.maxHp / 2);
			attacker.hp = Math.max(0, attacker.hp - crashDamage);
			messageLog.push(`<span style="color: #dc3545;">${attacker.species} kept going and crashed!</span>`);
			handleHPDropEffects(attackerSlot, battle, messageLog);
		}

		// Blunder Policy
		if (battle.magicRoomTurns === 0 && attacker.item === 'blunderpolicy') {
			messageLog.push(`${attacker.species}'s Blunder Policy was activated!`);
			setItem(attackerSlot, undefined, undefined, battle, messageLog);
			applyStatChange(attackerSlot, 'spe', 2, battle, messageLog, attackerSlot);
		}

		return false;
	}

	return true;
}

/**
 * Checks if a move bypasses the target's Substitute.
 */
export function checkSubstituteBypass(
	defenderSlot: ActivePokemonSlot,
	attackerSlot: ActivePokemonSlot,
	move: Move
): boolean {
	if (!defenderSlot.substitute) return true; 

	if (move.flags.bypasssub) return true;
	if (move.flags.sound) return true;

	const attackerAbility = toID(attackerSlot.pokemon.ability || '');
	if (attackerAbility === 'infiltrator') return true;

	return false;
}

export function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	spreadMultiplier: number
) {
	if (RPGMoves.handleDamagingMovePreamble(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	const attacker = attackerSlot.pokemon;
	let moveWasSuccessful = false;
	const hitCount = RPGAbilities.getMultiHitCount(attacker, move);
	const hasParentalBond = RPGAbilities.hasParentalBond(attacker);
	const totalHits = hasParentalBond && hitCount === 1 ? 2 : hitCount;

	if (totalHits > 1) {
		const hitMessage = hasParentalBond ?
			` <i style="color: #6c757d;">(Parental Bond hit twice!)</i>` :
			` <i style="color: #6c757d;">(It hit ${totalHits} times!)</i>`;
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += hitMessage;
		} else {
			messageLog.push(hitMessage);
		}
	}

	for (let i = 0; i < totalHits; i++) {
		let parentalBondSpreadMultiplier = spreadMultiplier;
		if (hasParentalBond && i === 1) {
			parentalBondSpreadMultiplier *= 0.25;
		}

		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle, parentalBondSpreadMultiplier);
		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}
		if (move.id === 'spitup') {
			moveWasSuccessful = true;
		}

		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defenderSlot.pokemon.species}'s ${itemName} weakened the attack!`);
			}
			consumeBerry(defenderSlot, attackResult.berryConsumed, messageLog);
		}

		if (attackResult.gemConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.gemConsumed]?.name || attackResult.gemConsumed;
			messageLog.push(`The ${itemName} strengthened ${attacker.species}'s power!`);
			setItem(attackerSlot, undefined, undefined, battle, messageLog); // Consume Gem
		}

		const abilityContext = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
		const damageDealt = applyDamageAndEnduranceEffects(defenderSlot, attackResult.damage, move, battle, messageLog, abilityContext);

		if (damageDealt > 0 && move.category !== 'Status') {
			defenderSlot.lastDamageTaken = {
				amount: damageDealt,
				category: move.category,
				from: attacker.id,
			};
		}

		if (totalHits > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += ` <i style="color: #007bff;">(${damageDealt} damage)</i>` + attackResult.message;
		} else {
			messageLog.push(`<i style="color: #007bff;">(${damageDealt} damage)</i>` + attackResult.message);
		}

		if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item === 'airballoon' &&
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defenderSlot.pokemon.species}'s Air Balloon popped!`);
			setItem(defenderSlot, undefined, undefined, battle, messageLog);
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			if (move.drain && attacker.hp < attacker.maxHp) {
				const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attacker);
				// Big Root logic for drain
				let drainFraction = move.drain[0] / move.drain[1];
				if (battle.magicRoomTurns === 0 && attacker.item === 'bigroot') {
					drainFraction *= 1.3;
				}

				if (defenderAbility === 'liquidooze') {
					const drainAmount = Math.max(1, Math.floor(damageDealt * drainFraction));
					if (RPGAbilities.takesIndirectDamage(attacker)) {
						attacker.hp = Math.max(0, attacker.hp - drainAmount);
						messageLog.push(`${attacker.species} was hurt by ${defenderSlot.pokemon.species}'s Liquid Ooze!`);
					}
				} else if (attackerSlot.healBlockTurns > 0) {
					messageLog.push(`${attacker.species} can't restore HP due to Heal Block!`);
				} else {
					const drainAmount = Math.max(1, Math.floor(damageDealt * drainFraction));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
					messageLog.push(`${defenderSlot.pokemon.species} had its energy drained!`);
				}
			}
			
			// Shell Bell Logic - Blocked by Sheer Force
			if (!attackResult.sheerForceActive && battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns <= 0) {
					let healAmount = Math.max(1, Math.floor(damageDealt / 8));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
					messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
				}
			}

			applyPostDamageContactEffects(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.effectiveness, abilityContext, attackResult.isCritical);

			handleOnHitAbilityResponses(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.isCritical);

			handleHPDropEffects(defenderSlot, battle, messageLog);

			// Eject Button Logic - Blocked by Sheer Force
			if (!attackResult.sheerForceActive && battle.magicRoomTurns === 0 && defenderSlot.pokemon.item === 'ejectbutton' && defenderSlot.pokemon.hp > 0 && !battle.pendingPivot && !battle.aiPendingPivot) {
				let slotIndex = battle.playerSlots.indexOf(defenderSlot);
				let isPlayer = true;
				if (slotIndex === -1) {
					slotIndex = battle.opponentSlots.indexOf(defenderSlot);
					isPlayer = false;
				}

				if (slotIndex !== -1) {
					setItem(defenderSlot, undefined, undefined, battle, messageLog);
					messageLog.push(`${defenderSlot.pokemon.species} is being switched out by its Eject Button!`);

					if (isPlayer) {
						battle.pendingPivot = { slotIndex, slot: defenderSlot, isBatonPass: false };
						battle.playerSlots[slotIndex as 0 | 1] = null;
					} else {
						battle.aiPendingPivot = { slotIndex, slot: defenderSlot, isBatonPass: false };
						battle.opponentSlots[slotIndex as 0 | 1] = null;
					}
				}
			}
		}

		// Pass sheerForceActive to prevent Life Orb recoil
		applyRecoilAndSelfEffects(attackerSlot, move, battle, messageLog, damageDealt, moveWasSuccessful, attackResult.sheerForceActive);

		if (move.id === 'knockoff' && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item && moveWasSuccessful) {
			const defender = defenderSlot.pokemon;
			// Check substitute
			if (!checkSubstituteBypass(defenderSlot, attackerSlot, move) && defenderSlot.substitute) {
				messageLog.push(`But ${defender.species}'s Substitute blocked the item removal!`);
			} else if (RPGAbilities.checkItemRemovalPrevention(defender)) {
				messageLog.push(`${defender.species}'s ${defender.ability} prevents its item from being removed!`);
			} else {
				const itemName = ITEMS_DATABASE[defender.item]?.name || defender.item;
				if (setItem(defenderSlot, undefined, attackerSlot, battle, messageLog)) {
					messageLog.push(`${attacker.species} knocked off ${defender.species}'s ${itemName}!`);
				} else {
					messageLog.push(`${attacker.species} couldn't knock off ${defender.species}'s item!`);
				}
			}
		}

		if (move.id === 'rapidspin' && attackerSlot.pokemon.hp > 0 && moveWasSuccessful) {
			const playerIsUser = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
			const userHazards = playerIsUser ? battle.playerHazards : battle.opponentHazards;
			if (userHazards.length > 0) {
				userHazards.length = 0;
				messageLog.push(`${attacker.species} blew away the hazards!`);
			}
			if (attackerSlot.isSeeded) {
				attackerSlot.isSeeded = false;
				messageLog.push(`${attacker.species} shook off the Leech Seed!`);
			}
			applyStatChange(attackerSlot, 'spe', 1, battle, messageLog, attackerSlot);
		}

		if (move.id === 'clearsmog' && defenderSlot.pokemon.hp > 0 && moveWasSuccessful) {
			const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attacker);
			if (defenderAbility !== 'fullmetalbody' && defenderAbility !== 'whitesmoke' && defenderAbility !== 'clearbody' && defenderSlot.pokemon.item !== 'clearamulet') {
				defenderSlot.statStages = { ...INITIAL_STAT_STAGES };
				messageLog.push(`${defenderSlot.pokemon.species}'s stat changes were reset!`);
			} else {
				messageLog.push(`${defenderSlot.pokemon.species}'s stats were protected!`);
			}
		}

		if (move.id === 'steelroller' && moveWasSuccessful && battle.terrain) {
			const terrainName = battle.terrain.type.charAt(0).toUpperCase() + battle.terrain.type.slice(1);
			battle.terrain = undefined;
			messageLog.push(`The ${terrainName} Terrain was removed!`);
		}

		if (move.id === 'terablast' && attackerSlot.terastallized === 'Stellar' && moveWasSuccessful) {
			if (attackerSlot.statStages.atk > -6) {
				attackerSlot.statStages.atk--;
				messageLog.push(`${attackerSlot.pokemon.species}'s Attack fell!`);
			}
			if (attackerSlot.statStages.spa > -6) {
				attackerSlot.statStages.spa--;
				messageLog.push(`${attackerSlot.pokemon.species}'s Special Attack fell!`);
			}
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			const defenderSpecies = Dex.species.get(defenderSlot.pokemon.species);
			const isGhost = defenderSpecies.types.includes('Ghost');

			if (['anchorshot', 'spiritshackle', 'thousandwaves'].includes(move.id) && defenderSlot?.pokemon.hp > 0) {
				if (!defenderSlot.isTrapped && (move.id === 'spiritshackle' || !isGhost)) {
					defenderSlot.isTrapped = { turns: 5 };
					messageLog.push(`${defenderSlot.pokemon.species} can no longer escape!`);
				}
			}
			if (move.id === 'jawlock' && defenderSlot?.pokemon.hp > 0 && attackerSlot?.pokemon.hp > 0) {
				if (!defenderSlot.isTrapped && !isGhost) {
					defenderSlot.isTrapped = { turns: 5 };
					messageLog.push(`${defenderSlot.pokemon.species} can no longer escape!`);
				}
				if (!attackerSlot.isTrapped) {
					attackerSlot.isTrapped = { turns: 5 };
					messageLog.push(`${attackerSlot.pokemon.species} can no longer escape!`);
				}
			}

			if (move.id === 'wakeupslap' && defenderSlot.status === 'slp' && defenderSlot?.pokemon.hp > 0) {
				defenderSlot.status = null;
				defenderSlot.sleepCounter = 0;
				messageLog.push(`${defenderSlot.pokemon.species} woke up!`);
			}

			if (move.id === 'smellingsalts' && defenderSlot.status === 'par' && defenderSlot?.pokemon.hp > 0) {
				defenderSlot.status = null;
				messageLog.push(`${defenderSlot.pokemon.species} was cured of paralysis!`);
			}

			if (['dragontail', 'circlethrow'].includes(move.id) && defenderSlot?.pokemon.hp > 0) {
				const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attacker);
				if (defenderAbility === 'suctioncups') {
					messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} anchors it in place!`);
				} else if (defenderSlot.isIngrained) {
					messageLog.push(`${defenderSlot.pokemon.species} is rooted in place!`);
				} else {
					const isDefenderPlayer = battle.playerSlots.includes(defenderSlot);
					const defenderSlotIndex = (isDefenderPlayer ? battle.playerSlots : battle.opponentSlots).indexOf(defenderSlot);
					const party = isDefenderPlayer ? getPlayerData(battle.playerId).party : battle.opponentParty;

					const availableReplacements = party.filter(p =>
						p.hp > 0 &&
						!battle.playerSlots.some(s => s?.pokemon.id === p.id) &&
						!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
					);

					if (availableReplacements.length === 0) {
						messageLog.push(`But it failed! (No Pokémon to switch to!)`);
					} else {
						messageLog.push(`${defenderSlot.pokemon.species} was blown away!`);
						if (defenderSlotIndex !== -1) {
							if (isDefenderPlayer) {
								battle.playerSlots[defenderSlotIndex as 0 | 1] = null;
							} else {
								battle.opponentSlots[defenderSlotIndex as 0 | 1] = null;
							}
						}
					}
				}
			}
		}

		if (defenderSlot.pokemon.hp <= 0) break;
	}

	if (moveWasSuccessful && defenderSlot.pokemon.hp > 0) {
		const abilityContext = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
		// Pass sheerForceActive
		const appliesSecondaries = RPGAbilities.shouldApplySecondaryEffects(attacker, move);
		const sheerForceActive = !appliesSecondaries;
		applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext, sheerForceActive);
	}

	// Throat Spray Logic
	if (moveWasSuccessful && move.flags.sound && battle.magicRoomTurns === 0 && attacker.item === 'throatspray') {
		if (applyStatChange(attackerSlot, 'spa', 1, battle, messageLog, attackerSlot)) {
			messageLog[messageLog.length - 1] += ` (from Throat Spray)!`;
			setItem(attackerSlot, undefined, undefined, battle, messageLog);
		}
	}
}

export function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const defenderSpecies = defender ? Dex.species.get(defender.species) : null;

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'prankster' && defenderSpecies?.types.includes('Dark')) {
		messageLog.push(`${defender!.species} is immune to Prankster-boosted moves!`);
		return;
	}

	if (defender && defenderSpecies && move.target !== 'self' && !move.flags.heal) {
		const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle, attackerSlot.pokemon, move.id);
		if (effectiveness === 0) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
	}

	if (RPGMoves.handleSpecificStatusMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericStatusInflictMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericVolatileMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericFieldMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericSideMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericHealMove(attackerSlot, move, messageLog)) {
		return;
	}

	if (move.selfSwitch) {
		return;
	}

	messageLog.push(`But it failed!`);
}

export function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number
): { damage: number, message: string, effectiveness: number, berryConsumed?: string, gemConsumed?: string, isCritical: boolean, sheerForceActive: boolean } {
	const moveData = getMove(moveId);
	const move = { ...moveData };
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);

	const abilityContext: any = {
		attacker,
		defender,
		attackerSlot,
		defenderSlot,
		move,
		battle,
		messageLog: [],
	};

	// Calculate Sheer Force status early
	const appliesSecondaries = RPGAbilities.shouldApplySecondaryEffects(attacker, move);
	const sheerForceActive = !appliesSecondaries;

	if (move.flags.powder && defenderSpecies.types.includes('Grass')) {
		return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0, isCritical: false, sheerForceActive };
	}
	const immunityCheck = RPGAbilities.checkImmunity(abilityContext);
	if (immunityCheck?.immune) {
		return { damage: 0, message: ` <i style="color: #6c757d;">${immunityCheck.message}</i>`, effectiveness: 0, isCritical: false, sheerForceActive };
	}

	if (!move.basePower) {
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1, isCritical: false, sheerForceActive };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1, isCritical: false, sheerForceActive };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1, isCritical: false, sheerForceActive };
		}
		if (moveId === 'psywave') {
			return { damage: Math.floor(Math.random() * attacker.level * 1.5) + 1, message: '', effectiveness: 1, isCritical: false, sheerForceActive };
		}
		if (moveId === 'superfang') {
			return { damage: Math.floor(defender.hp / 2), message: '', effectiveness: 1, isCritical: false, sheerForceActive };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1, isCritical: false, sheerForceActive };
	}

	if (move.id === 'terablast' && attackerSlot.terastallized) {
		if (attacker.atk > attacker.spa) {
			move.category = 'Physical';
		}
		if (attackerSlot.terastallized === 'Stellar') {
			move.basePower = 100;
		}
	}

	let basePower = RPGMoves.getDamageBasePower(move, attacker, defender, attackerSlot, defenderSlot, battle);
	if (basePower === -1) {
		const healAmount = Math.floor(defender.maxHp * 0.25);
		defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0, isCritical: false, sheerForceActive };
	}

	const moveType = getMoveType(move, attacker, attackerSlot, battle, abilityContext);
	abilityContext.move.type = moveType;

	basePower = RPGAbilities.applyPowerModifier(abilityContext, basePower);

	const attackStatRaw = getDamageOffense(move, attacker, attackerSlot, battle, abilityContext);
	const defenseStatRaw = getDamageDefense(move, defender, defenderSlot, battle, attacker);

	let attackStage: number;
	if (move.id === 'foulplay') {
		attackStage = defenderSlot.statStages.atk;
	} else if (move.id === 'bodypress') {
		attackStage = attackerSlot.statStages.def;
	} else {
		attackStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	}

	let defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd) :
		(move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def);

	if (['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		defenseStage = battle.wonderRoomTurns > 0 ? defenderSlot.statStages.spd : defenderSlot.statStages.def;
	}

	const defenderAbility = RPGAbilities.getActiveAbility(defender, attacker);
	const attackerAbility = toID(attacker.ability || '');

	// Unaware Fix: Ignored ALL stages, positive and negative.
	if (attackerAbility === 'unaware') {
		defenseStage = 0;
	}

	if (defenderAbility === 'unaware') {
		attackStage = 0;
	}

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	let defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerSlot.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && attackerAbility !== 'guts') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		defenseStat = Math.floor(defenseStat * 0.5);
	}

	defenseStat = Math.max(1, defenseStat);
	finalAttackStat = Math.max(1, finalAttackStat);

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const criticalMultiplier = isCritical ? (attackerAbility === 'sniper' ? 2.25 : 1.5) : 1;
	const stabMultiplier = RPGAbilities.getSTABMultiplier(attacker, moveType, attackerSlot);
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	const defenderTypes = getPokemonTypes(defender, defenderSlot);

	let effectiveness: number;
	if (moveId === 'struggle') {
		effectiveness = 1;
	} else {
		effectiveness = getCustomEffectiveness(moveType, defenderTypes, defender, battle, attacker, move.id);
	}

	abilityContext.effectiveness = effectiveness;

	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;
	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	let baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / defenseStat)) / 50) + 2);

	// Metronome Logic
	if (battle.magicRoomTurns === 0 && attacker.item === 'metronome') {
		const count = attackerSlot.consecutiveMoveCount || 0;
		const multiplier = 1 + (Math.min(5, count) * 0.2);
		baseDamage = Math.floor(baseDamage * multiplier);
	}

	let damage = applyFinalDamageModifiers(
		baseDamage, move, moveType, attacker, defender,
		attackerSlot, defenderSlot, battle, effectiveness, isCritical, abilityContext
	);

	// Gem Consumable Logic
	let gemConsumed: string | undefined = undefined;
	if (battle.magicRoomTurns === 0 && attacker.item && attacker.item.endsWith('gem')) {
		const gemType = attacker.item.replace('gem', '');
		if (gemType.toLowerCase() === moveType.toLowerCase()) {
			damage = Math.floor(damage * 1.3); // Modern gen boost
			gemConsumed = attacker.item;
		}
	}

	damage = Math.floor(damage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);
	damage = Math.floor(damage * spreadMultiplier);

	if (!isFinite(damage) || isNaN(damage) || damage < 0) {
		damage = 1;
	}
	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed, gemConsumed, isCritical, sheerForceActive };
}

export function getDamageOffense(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	abilityContext: AbilityContext
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spa' : 'atk';
	let attackStatRaw: number;

	if (move.id === 'foulplay') {
		const defender = abilityContext.defender;
		attackStatRaw = defender.atk;
		statName = 'atk';
	} else if (move.id === 'bodypress') {
		attackStatRaw = attacker.def;
		statName = 'def';
	} else {
		attackStatRaw = attacker[statName];
	}

	attackStatRaw = RPGAbilities.applyAbilityStatModifier(attacker, statName, attackStatRaw, attackerSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		if (attacker.item === 'choicespecs' && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		// Species specific items
		if (attacker.item === 'lightball' && attacker.species.includes('Pikachu')) {
			attackStatRaw = Math.floor(attackStatRaw * 2);
		}
		if (attacker.item === 'thickclub' && (attacker.species.includes('Cubone') || attacker.species.includes('Marowak')) && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 2);
		}
		if (attacker.item === 'deepseatooth' && attacker.species.includes('Clamperl') && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 2);
		}
		// Soul Dew
		if (attacker.item === 'souldew' && (attacker.species.includes('Latios') || attacker.species.includes('Latias'))) {
			if (isSpecial) attackStatRaw = Math.floor(attackStatRaw * 1.5); // Gen 6- style stat boost based on item description
		}
	}

	if (isSpecial && RPGAbilities.isWeatherActive(battle) && (battle.weather?.type === 'sun' || battle.weather?.type === 'harsh-sun')) {
		if (toID(attacker.ability || '') === 'solarpower') {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	return attackStatRaw;
}

export function getDamageDefense(
	move: Move,
	defender: RPGPokemon,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState,
	attacker?: RPGPokemon
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spd' : 'def';

	if (isSpecial && ['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		statName = 'def';
	}

	if (battle.wonderRoomTurns > 0) {
		statName = isSpecial ? 'def' : 'spd';
	}

	let defenseStatRaw = defender[statName];

	defenseStatRaw = RPGAbilities.applyAbilityStatModifier(defender, statName, defenseStatRaw, defenderSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (defender.item === 'assaultvest' && isSpecial && battle.wonderRoomTurns === 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}

		if (defender.item === 'eviolite') {
			const species = Dex.species.get(defender.species);
			if (species.evos && species.evos.length > 0) {
				const defWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'def', defender.def, defenderSlot, battle);
				const spdWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'spd', defender.spd, defenderSlot, battle);

				if (statName === 'def') {
					defenseStatRaw = Math.floor(defWithAbility * 1.5);
				} else {
					defenseStatRaw = Math.floor(spdWithAbility * 1.5);
				}
			}
		}

		// Species specific defense items
		if (defender.item === 'deepseascale' && defender.species.includes('Clamperl') && isSpecial) {
			defenseStatRaw = Math.floor(defenseStatRaw * 2);
		}
		if (defender.item === 'metalpowder' && defender.species.includes('Ditto') && !isSpecial) {
			defenseStatRaw = Math.floor(defenseStatRaw * 2);
		}
		// Soul Dew
		if (defender.item === 'souldew' && (defender.species.includes('Latios') || defender.species.includes('Latias'))) {
			if (isSpecial) defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}
	}

	// Weather Defense Boosts
	if (RPGAbilities.isWeatherActive(battle)) {
		const species = Dex.species.get(defender.species);
		if (battle.weather?.type === 'sand' && isSpecial && species.types.includes('Rock')) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}
		if (battle.weather?.type === 'hail' && !isSpecial && species.types.includes('Ice')) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}
	}

	return defenseStatRaw;
}

export function getMoveType(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	abilityContext: AbilityContext
): string {
	let moveType = move.type;

	if (move.id === 'terablast' && attackerSlot.terastallized) {
		moveType = attackerSlot.terastallized;
	} else if (move.id === 'weatherball') {
		if (RPGAbilities.isWeatherActive(battle)) {
			switch (battle.weather!.type) {
			case 'sun': moveType = 'Fire'; break;
			case 'rain': moveType = 'Water'; break;
			case 'sand': moveType = 'Rock'; break;
			case 'hail': moveType = 'Ice'; break;
			}
		} else if (battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
			switch (battle.terrain.type) {
			case 'electric': moveType = 'Electric'; break;
			case 'grassy': moveType = 'Grass'; break;
			case 'psychic': moveType = 'Psychic'; break;
			case 'misty': moveType = 'Fairy'; break;
			}
		}
	} else if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	moveType = RPGAbilities.applyTypeModifier(abilityContext, moveType);
	return moveType;
}

export function applyFinalDamageModifiers(
	baseDamage: number,
	move: Move,
	moveType: string,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState,
	effectiveness: number,
	isCritical: boolean,
	abilityContext: AbilityContext
): number {
	let damage = baseDamage;

	const attackerAbility = toID(attacker.ability || '');
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);

	if (attackerAbility !== 'infiltrator' && !isCritical) {
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
		if (defenderVeilTurns > 0) {
			damage = Math.floor(damage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) damage = Math.floor(damage * 0.5);
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) damage = Math.floor(damage * 0.5);
			}
		}
	}

	if (RPGAbilities.isWeatherActive(battle)) {
		const attackerHasUmbrella = battle.magicRoomTurns === 0 && attacker.item === 'utilityumbrella';
		
		if (battle.weather!.type === 'sun' || battle.weather!.type === 'harsh-sun') {
			if (moveType === 'Fire' && !attackerHasUmbrella) damage = Math.floor(damage * 1.5);
			if (moveType === 'Water' && !attackerHasUmbrella) damage = Math.floor(damage * 0.5);
		} else if (battle.weather!.type === 'rain' || battle.weather!.type === 'heavy-rain') {
			if (moveType === 'Water' && !attackerHasUmbrella) damage = Math.floor(damage * 1.5);
			if (moveType === 'Fire' && !attackerHasUmbrella) damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
		const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		damage = Math.floor(damage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		damage = Math.floor(damage * 0.33);
	}

	damage = RPGAbilities.applyDamageModifier(abilityContext, damage);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'lifeorb') {
			damage = Math.floor(damage * 1.3);
		}
		if (attacker.item === 'expertbelt' && effectiveness > 1) {
			damage = Math.floor(damage * 1.2);
		}
		// Muscle Band & Wise Glasses
		if (attacker.item === 'muscleband' && move.category === 'Physical') {
			damage = Math.floor(damage * 1.1);
		}
		if (attacker.item === 'wiseglasses' && move.category === 'Special') {
			damage = Math.floor(damage * 1.1);
		}
		// Punching Glove
		if (attacker.item === 'punchingglove' && move.flags.punch) {
			damage = Math.floor(damage * 1.1);
		}

		// Type Enhancers
		if (attacker.item === 'charcoal' && moveType === 'Fire') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'mysticwater' && moveType === 'Water') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'miracleseed' && moveType === 'Grass') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'magnet' && moveType === 'Electric') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'nevermeltice' && moveType === 'Ice') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'blackbelt' && moveType === 'Fighting') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'poisonbarb' && moveType === 'Poison') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'softsand' && moveType === 'Ground') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'sharpbeak' && moveType === 'Flying') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'twistedspoon' && moveType === 'Psychic') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'silverpowder' && moveType === 'Bug') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'hardstone' && moveType === 'Rock') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'spelltag' && moveType === 'Ghost') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'dragonfang' && moveType === 'Dragon') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'blackglasses' && moveType === 'Dark') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'metalcoat' && moveType === 'Steel') damage = Math.floor(damage * 1.2);
		if (attacker.item === 'fairymemory' && moveType === 'Fairy') damage = Math.floor(damage * 1.2);

		// Creation Orbs
		if (attacker.item === 'adamantorb' && attacker.species.includes('Dialga') && (moveType === 'Dragon' || moveType === 'Steel')) {
			damage = Math.floor(damage * 1.2);
		}
		if (attacker.item === 'lustrousorb' && attacker.species.includes('Palkia') && (moveType === 'Dragon' || moveType === 'Water')) {
			damage = Math.floor(damage * 1.2);
		}
		if (attacker.item === 'griseousorb' && attacker.species.includes('Giratina') && (moveType === 'Dragon' || moveType === 'Ghost')) {
			damage = Math.floor(damage * 1.2);
		}
	}

	return damage;
}

export function getCriticalHitChance(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attackerSlot.pokemon);
	if (defenderAbility === 'battlearmor' || defenderAbility === 'shellarmor') {
		return 0;
	}

	if (['frostbreath', 'stormthrow', 'zipzapzap', 'surginstrikes'].includes(move.id)) {
		return 1;
	}

	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	const abilityId = toID(attacker.ability || '');
	if (abilityId === 'merciless' && (defenderSlot.status === 'psn' || defenderSlot.status === 'tox')) {
		return 1;
	}

	if (attackerSlot.focusEnergy) {
		critStage += 2;
	}

	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'superluck') {
		critStage += 1;
	}

	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1];
	return critChances[Math.min(critStage, 3)];
}

export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 + Math.abs(stage));
	}
}

export function applyDamageAndEnduranceEffects(
	defenderSlot: ActivePokemonSlot,
	damageDealt: number,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext
): number {
	const defender = defenderSlot.pokemon;
	const defenderAbility = RPGAbilities.getActiveAbility(defender, abilityContext.attacker);
	const attackerAbility = toID(abilityContext.attacker.ability || '');

	if (defenderSlot.isDisguised && damageDealt > 0 && move.category !== 'Status') {
		if (defenderAbility === 'disguise') { // Mold Breaker ignores Disguise
			defenderSlot.isDisguised = false;
			if (defender.species === 'Mimikyu') {
				defender.species = 'Mimikyu-Busted';
			}
			messageLog.push(`<strong>${defender.species}'s Disguise was broken!</strong>`);
			defenderSlot.lastMoveThatHitMe = move;
			// Disguise damage (1/8 HP)
			const bustDamage = Math.floor(defender.maxHp / 8);
			defender.hp = Math.max(0, defender.hp - bustDamage);
			return 0;
		}
	}

	// Use the new Substitute Bypass Logic from Step 2
	const bypassesSub = checkSubstituteBypass(defenderSlot, abilityContext.attackerSlot, move);

	if (defenderSlot.substitute && damageDealt > 0 && !bypassesSub) {
		const subHP = defenderSlot.substitute.hp;
		if (damageDealt >= subHP) {
			defenderSlot.substitute = undefined;
			messageLog.push(`The substitute took the hit and broke!`);
		} else {
			defenderSlot.substitute.hp -= damageDealt;
			messageLog.push(`The substitute took the hit!`);
		}
		defenderSlot.lastMoveThatHitMe = move;
		return 0;
	}

	const isFullHP = defender.hp === defender.maxHp;

	if (damageDealt >= defender.hp) {
		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && isFullHP) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			setItem(defenderSlot, undefined, undefined, battle, messageLog);
		} else if (defenderAbility === 'sturdy' && isFullHP && move.ohko !== true) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Sturdy!`);
		}
	}

	defender.hp = Math.max(0, defender.hp - damageDealt);

	if (damageDealt > 0) {
		defenderSlot.lastMoveThatHitMe = move;
	}

	return damageDealt;
}

export function applyPostDamageContactEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	effectiveness: number,
	abilityContext: AbilityContext,
	isCritical: boolean
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	if (defender.hp <= 0 || damageDealt <= 0) return;

	const defenderAbility = toID(defender.ability || ''); // Anger Point is not blocked by Mold Breaker
	if (isCritical && defenderAbility === 'angerpoint') {
		applyStatChange(defenderSlot, 'atk', 6, battle, messageLog, defenderSlot);
	}

	if (battle.magicRoomTurns === 0) {
		if (move.category === 'Physical' && defender.item === 'keberry') {
			if (applyStatChange(defenderSlot, 'def', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Kee Berry)!`;
				consumeBerry(defenderSlot, 'keberry', messageLog);
			}
		} else if (move.category === 'Special' && defender.item === 'marangaberry') {
			if (applyStatChange(defenderSlot, 'spd', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Maranga Berry)!`;
				consumeBerry(defenderSlot, 'marangaberry', messageLog);
			}
		}
	}

	const attackerAbility = toID(attacker.ability || '');
	// Punching Glove protects against contact effects
	const isContact = move.flags.contact && attackerAbility !== 'longreach' && attacker.item !== 'protectivepads' && (battle.magicRoomTurns > 0 || attacker.item !== 'punchingglove');

	if (isContact && attacker.hp > 0) {
		if (battle.magicRoomTurns === 0) {
			if (defender.item === 'rockyhelmet' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
				messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
			}
			if (defender.item === 'jabocaberry' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
				messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
				consumeBerry(defenderSlot, 'jabocaberry', messageLog);
			}
		}
		if (attacker.hp > 0) {
			RPGAbilities.applyContactAbilityEffects(abilityContext);
		}
	}

	if (move.category === 'Special' && attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'rowapberry') {
		if (RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
			messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
			consumeBerry(defenderSlot, 'rowapberry', messageLog);
		}
	}

	const activeDefenderAbility = RPGAbilities.getActiveAbility(defender, attacker);
	if (activeDefenderAbility === 'cursedbody' && attacker.hp > 0 && !attackerSlot.disabledMove && Math.random() < 0.3) {
		attackerSlot.disabledMove = { moveId: move.id, turns: 4 };
		messageLog.push(`${attacker.species}'s ${move.name} was disabled by ${defender.species}'s Cursed Body!`);
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && effectiveness > 1) {
		let activated = false;
		if (applyStatChange(defenderSlot, 'atk', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}
		if (applyStatChange(defenderSlot, 'spa', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}

		if (activated) {
			messageLog.push(`${defender.species}'s Weakness Policy was activated!`);
			setItem(defenderSlot, undefined, undefined, battle, messageLog);
		}
	}

	if (attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'redcard') {
		const isPlayerDefending = battle.playerSlots.includes(defenderSlot);
		const attackerSlotIndex = (isPlayerDefending ? battle.opponentSlots : battle.playerSlots).indexOf(attackerSlot);

		if (attackerSlotIndex !== -1) {
			messageLog.push(`${defender.species}'s Red Card forced ${attacker.species} to switch out!`);
			setItem(defenderSlot, undefined, undefined, battle, messageLog);

			if (isPlayerDefending) {
				battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
			} else {
				battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
			}
		}
	}
}

export function handleOnHitAbilityResponses(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	isCritical: boolean
) {
	const defender = defenderSlot.pokemon;
	// These abilities are usually triggered by damage and are not blocked by Mold Breaker (except maybe Weak Armor)
	// But to be safe, we use getActiveAbility where appropriate.
	// Justified, Rattled, Stamina, Anger Point, Berserk, Thermal Exchange, Cotton Down, Anger Shell, etc.
	// Most of these are self-buffs, so Mold Breaker doesn't stop them.
	// Weak Armor affects the defender (lowers def, raises speed), so it is not blocked by attacker's Mold Breaker.
	
	const defenderAbility = toID(defender.ability || '');
	const attacker = attackerSlot.pokemon;

	if (defenderAbility === 'justified' && move.type === 'Dark' && damageDealt > 0) {
		if (defenderSlot.statStages.atk < 6) {
			defenderSlot.statStages.atk++;
			messageLog.push(`${defender.species}'s Justified raised its Attack!`);
		}
	}

	if (defenderAbility === 'rattled' && ['Bug', 'Dark', 'Ghost'].includes(move.type) && damageDealt > 0) {
		if (defenderSlot.statStages.spe < 6) {
			defenderSlot.statStages.spe++;
			messageLog.push(`${defender.species}'s Rattled raised its Speed!`);
		}
	}

	if (defenderAbility === 'stamina' && damageDealt > 0) {
		if (defenderSlot.statStages.def < 6) {
			defenderSlot.statStages.def++;
			messageLog.push(`${defender.species}'s Stamina raised its Defense!`);
		}
	}

	if (defenderAbility === 'weakarmor' && move.category === 'Physical' && damageDealt > 0) {
		let changed = false;
		if (defenderSlot.statStages.def > -6) {
			defenderSlot.statStages.def--;
			messageLog.push(`${defender.species}'s Weak Armor lowered its Defense!`);
			changed = true;
		}
		if (defenderSlot.statStages.spe < 6) {
			defenderSlot.statStages.spe = Math.min(6, defenderSlot.statStages.spe + 2);
			messageLog.push(`${defender.species}'s Weak Armor sharply raised its Speed!`);
			changed = true;
		}
	}

	if (defenderAbility === 'angerpoint' && isCritical && damageDealt > 0) {
		if (defenderSlot.statStages.atk < 6) {
			defenderSlot.statStages.atk = 6;
			messageLog.push(`${defender.species}'s Anger Point maxed its Attack!`);
		}
	}

	if (defenderAbility === 'berserk' && damageDealt > 0) {
		const hpBefore = defender.hp + damageDealt;
		const halfHP = defender.maxHp / 2;
		if (hpBefore >= halfHP && defender.hp < halfHP) {
			if (defenderSlot.statStages.spa < 6) {
				defenderSlot.statStages.spa++;
				messageLog.push(`${defender.species}'s Berserk raised its Sp. Atk!`);
			}
		}
	}

	if (defenderAbility === 'thermalexchange' && move.type === 'Fire' && damageDealt > 0) {
		if (defenderSlot.statStages.atk < 6) {
			defenderSlot.statStages.atk++;
			messageLog.push(`${defender.species}'s Thermal Exchange raised its Attack!`);
		}
	}

	if (defenderAbility === 'cottondown' && damageDealt > 0 && move.category !== 'Status') {
		const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
		const opponentSlots = isDefenderPlayer ? battle.opponentSlots : battle.playerSlots;

		let affectedAny = false;
		for (const oppSlot of opponentSlots) {
			if (oppSlot && oppSlot.pokemon.hp > 0) {
				// Apply Stat Change handles ability immunities (like Clear Body vs Cotton Down)
				if (applyStatChange(oppSlot, 'spe', -1, battle, messageLog, defenderSlot)) {
					affectedAny = true;
				}
			}
		}
		if (affectedAny) {
			messageLog.push(`${defender.species}'s Cotton Down lowered the Speed of opposing Pokémon!`);
		}
	}

	if (defenderAbility === 'angershell' && damageDealt > 0) {
		const hpBefore = defender.hp + damageDealt;
		const halfHP = defender.maxHp / 2;
		if (hpBefore >= halfHP && defender.hp < halfHP) {
			const messages: string[] = [];
			if (defenderSlot.statStages.def > -6) {
				defenderSlot.statStages.def--;
				messages.push('Defense fell');
			}
			if (defenderSlot.statStages.spd > -6) {
				defenderSlot.statStages.spd--;
				messages.push('Sp. Def fell');
			}
			if (defenderSlot.statStages.atk < 6) {
				defenderSlot.statStages.atk++;
				messages.push('Attack rose');
			}
			if (defenderSlot.statStages.spa < 6) {
				defenderSlot.statStages.spa++;
				messages.push('Sp. Atk rose');
			}
			if (defenderSlot.statStages.spe < 6) {
				defenderSlot.statStages.spe++;
				messages.push('Speed rose');
			}
			if (messages.length > 0) {
				messageLog.push(`${defender.species}'s Anger Shell: ${messages.join(', ')}!`);
			}
		}
	}

	if (defenderAbility === 'seedsower' && damageDealt > 0 && battle.terrain?.type !== 'grassy') {
		battle.terrain = { type: 'grassy', turns: 5 };
		messageLog.push(`${defender.species}'s Seed Sower created Grassy Terrain!`);
	}

	if (defenderAbility === 'sandspit' && damageDealt > 0 && battle.weather?.type !== 'sand') {
		battle.weather = { type: 'sand', turns: 5 };
		messageLog.push(`${defender.species}'s Sand Spit created a sandstorm!`);
	}

	if (defenderAbility === 'steamengine' && ['Fire', 'Water'].includes(move.type) && damageDealt > 0) {
		const stages = Math.min(6, 6 - defenderSlot.statStages.spe);
		if (stages > 0) {
			defenderSlot.statStages.spe = Math.min(6, defenderSlot.statStages.spe + stages);
			const message = stages >= 2 ? 'sharply raised' : 'raised';
			messageLog.push(`${defender.species}'s Steam Engine ${message} its Speed!`);
		}
	}

	if (defenderAbility === 'toxicdebris' && move.category === 'Physical' && damageDealt > 0) {
		const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
		const opponentHazards = isDefenderPlayer ? battle.opponentHazards : battle.playerHazards;

		const toxicSpikesCount = opponentHazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikesCount < 2) {
			opponentHazards.push('toxicspikes');
			messageLog.push(`${defender.species}'s Toxic Debris scattered Toxic Spikes!`);
		}
	}

	if (defenderAbility === 'gulpmissile' && damageDealt > 0 && attacker.hp > 0) {
		const gulpForm = (defenderSlot as any).gulpMissileForm;

		if (gulpForm === 'gulping') {
			const damageAmount = Math.floor(attacker.maxHp / 4);
			attacker.hp = Math.max(0, attacker.hp - damageAmount);
			messageLog.push(`${defender.species} spit out its catch at ${attacker.species}!`);

			if (attacker.hp > 0 && attackerSlot.statStages.def > -6) {
				attackerSlot.statStages.def--;
				messageLog.push(`${attacker.species}'s Defense fell!`);
			}

			if (defender.species.includes('Gulping')) {
				defender.species = 'Cramorant';
			}
			(defenderSlot as any).gulpMissileForm = null;
		} else if (gulpForm === 'gorging') {
			const damageAmount = Math.floor(attacker.maxHp / 4);
			attacker.hp = Math.max(0, attacker.hp - damageAmount);
			messageLog.push(`${defender.species} spit out its catch at ${attacker.species}!`);

			if (attacker.hp > 0 && !attackerSlot.status) {
				const attackerSpecies = Dex.species.get(attacker.species);
				if (!attackerSpecies.types.includes('Electric')) {
					attackerSlot.status = 'par';
					messageLog.push(`${attacker.species} was paralyzed!`);
				}
			}

			if (defender.species.includes('Gorging')) {
				defender.species = 'Cramorant';
			}
			(defenderSlot as any).gulpMissileForm = null;
		}
	}
}

export function applyRecoilAndSelfEffects(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	moveWasSuccessful: boolean,
	sheerForceActive: boolean = false
) {
	if (attackerSlot.pokemon.hp <= 0) return;
	const attacker = attackerSlot.pokemon;

	let tookRecoil = false;

	if (['mindblown', 'steelbeam'].includes(move.id)) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 2));
			messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
			tookRecoil = true;
		} else {
			messageLog.push(`${attacker.species}'s ${attacker.ability} prevents recoil!`);
		}
	} else if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		const attackerAbility = toID(attacker.ability || '');
		const sheerForceActive = attackerAbility === 'sheerforce' && (move.secondary || move.secondaries);
		if (!sheerForceActive && RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
			messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
			tookRecoil = true;
		}
	} else if (move.id === 'struggle') {
		attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(attacker.maxHp / 4)));
		messageLog.push(`${attacker.species} was damaged by recoil!`);
		tookRecoil = true;
	} else if (move.recoil) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1]))));
			messageLog.push(`${attacker.species} was damaged by recoil!`);
			tookRecoil = true;
		}
	}

	if (tookRecoil) {
		handleHPDropEffects(attackerSlot, battle, messageLog);
	}

	if (attacker.hp > 0 && move.self?.boosts) {
		const boosts = move.self.boosts;
		for (const stat in boosts) {
			const statKey = stat as keyof ActivePokemonSlot['statStages'];
			const boostValue = boosts[statKey]!;
			applyStatChange(attackerSlot, statKey, boostValue, battle, messageLog, attackerSlot);
		}
	}

	if (moveWasSuccessful && ['selfdestruct', 'explosion', 'mistyexplosion', 'finalgambit'].includes(move.id)) {
		attacker.hp = 0;
		messageLog.push(`**${attacker.species} fainted from using ${move.name}!**`);
	}
}

export function applySecondaryEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext,
	sheerForceActive: boolean = false
) {
	if (sheerForceActive) return;

	// Covert Cloak Check
	if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.item === 'covertcloak') return;

	if (!move.secondary || !RPGAbilities.shouldApplySecondaryEffects(attackerSlot.pokemon, move)) return;

	let chance = move.secondary.chance || 100;
	chance = RPGAbilities.applySereneGrace(abilityContext, chance);

	if (Math.random() * 100 < chance) {
		const canApplyToDefender = defenderSlot.pokemon.hp > 0 && !defenderSlot.substitute;
		const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attackerSlot.pokemon);
		const shieldDustBlocks = defenderAbility === 'shielddust';

		if (canApplyToDefender && !shieldDustBlocks) {
			if (move.secondary.status && !defenderSlot.status) {
				// Use central status check
				let statusToInflict = move.secondary.status;
				if (statusToInflict === 'toxic') statusToInflict = 'tox';

				const canInflict = RPGAbilities.canInflictStatus(
					defenderSlot, 
					statusToInflict as any, 
					battle, 
					attackerSlot, 
					move, 
					true
				);

				if (canInflict.success) {
					const newStatus = statusToInflict as any;
					defenderSlot.status = newStatus;
					if (newStatus === 'tox') {
						defenderSlot.toxicCounter = 1;
					}
					if (newStatus === 'slp') {
						defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
					}
					messageLog.push(`${defenderSlot.pokemon.species} was afflicted with ${statusToInflict}!`);

					const attackerAbilityId = toID(attackerSlot.pokemon.ability || '');
					if (attackerAbilityId === 'poisonpuppeteer' && (newStatus === 'psn' || newStatus === 'tox')) {
						if (!defenderSlot.isConfused) {
							defenderSlot.isConfused = true;
							defenderSlot.confusionCounter = Math.floor(Math.random() * 4) + 1;
							messageLog.push(`${defenderSlot.pokemon.species} became confused from Poison Puppeteer!`);
						}
					}

					const defenderAbilitySync = toID(defenderSlot.pokemon.ability || '');
					if (defenderAbilitySync === 'synchronize') {
						applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
					}
				}
			}

			if (move.secondary.boosts) {
				let hadEffect = false;
				let triggeredDefiant = false;

				for (const stat in move.secondary.boosts) {
					let boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!;

					if (toID(defenderSlot.pokemon.ability || '') === 'contrary') {
						boostValue *= -1;
					}

					const currentStage = defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages];

					if (boostValue < 0) {
						if (applyStatChange(defenderSlot, stat as any, boostValue, battle, messageLog, attackerSlot)) {
							hadEffect = true;
							triggeredDefiant = true;
						}
					} else if (boostValue > 0) {
						if (applyStatChange(defenderSlot, stat as any, boostValue, battle, messageLog, attackerSlot)) {
							hadEffect = true;
						}
					}
				}

				if (triggeredDefiant) {
					checkStatDropAbilities(defenderSlot, attackerSlot, battle, messageLog);
				}
			}

			if (move.secondary.volatileStatus === 'flinch') {
				if (!RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
					defenderSlot.willFlinch = true;
				} else {
					messageLog.push(`${defenderSlot.pokemon.species}'s Inner Focus prevents flinching!`);
				}
			}
		}

		if (move.secondary.self?.boosts) {
			const attackerAbility = toID(attackerSlot.pokemon.ability || '');

			for (const stat in move.secondary.self.boosts) {
				let boostValue = move.secondary.self.boosts[stat as keyof typeof move.secondary.self.boosts]!;

				if (attackerAbility === 'contrary') {
					boostValue *= -1;
				}

				applyStatChange(attackerSlot, stat as any, boostValue, battle, messageLog, attackerSlot);
			}
		}
	}

	// King's Rock / Razor Fang
	if (battle.magicRoomTurns === 0 && ['kingsrock', 'razorfang'].includes(attackerSlot.pokemon.item || '') && move.category !== 'Status') {
		const alreadyFlinches = move.secondary?.volatileStatus === 'flinch' || (move.secondaries && move.secondaries.some((s: any) => s.volatileStatus === 'flinch'));
		if (!alreadyFlinches) {
			if (Math.random() < 0.1 && !RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
				defenderSlot.willFlinch = true;
			}
		}
	}

	const attackerAbility = toID(attackerSlot.pokemon.ability || '');
	if (attackerAbility === 'stench' && move.category !== 'Status' && defenderSlot.pokemon.hp > 0) {
		if (Math.random() < 0.1 && !RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
			defenderSlot.willFlinch = true;
		}
	}
}

export function getPokemonTypes(pokemon: RPGPokemon, slot?: ActivePokemonSlot): string[] {
	if (slot?.terastallized) {
		return [slot.terastallized];
	}
	const species = Dex.species.get(pokemon.species);
	return species.types;
}

export function getCustomEffectiveness(
	moveType: string,
	defenderTypes: string[],
	defender: RPGPokemon,
	battle: BattleState,
	attacker?: RPGPokemon,
	moveId?: string
): number {
	let effectiveness = 1;

	// Special handling for Flying Press (Fighting + Flying)
	if (moveId === 'flyingpress') {
		let fightingEff = 1;
		let flyingEff = 1;
		
		const fightingChart = TYPE_CHART['Fighting'];
		const flyingChart = TYPE_CHART['Flying'];

		for (const type of defenderTypes) {
			// Fighting part
			if (fightingChart.superEffective.includes(type)) fightingEff *= 2;
			else if (fightingChart.notVeryEffective.includes(type)) fightingEff *= 0.5;
			else if (fightingChart.noEffect.includes(type)) fightingEff *= 0;

			// Flying part
			if (flyingChart.superEffective.includes(type)) flyingEff *= 2;
			else if (flyingChart.notVeryEffective.includes(type)) flyingEff *= 0.5;
			else if (flyingChart.noEffect.includes(type)) flyingEff *= 0;
		}

		return fightingEff * flyingEff;
	}

	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;

	const hasStrongWinds = battle.weather?.type === 'strong-winds';
	const isFlyingType = defenderTypes.includes('Flying');

	const attackerAbility = attacker ? toID(attacker.ability || '') : '';
	const hasMindEye = attackerAbility === 'mindseye';
	const hasScrappy = attackerAbility === 'scrappy';

	for (const defenderType of defenderTypes) {
		// Freeze-Dry check
		if (moveId === 'freezedry' && defenderType === 'Water') {
			effectiveness *= 2; // Super Effective on Water
			continue;
		}

		// Thousand Arrows check (grounding logic is usually elsewhere, but for effectiveness)
		// If it hits flying, it should be neutral unless other types interact. 
		// Standard chart says Ground vs Flying is 0. 
		// If grounding logic happens before this, defenderTypes won't have Flying or isGrounded returns true.
		// Assuming standard chart lookup:

		if (chartEntry.superEffective.includes(defenderType)) {
			if (hasStrongWinds && isFlyingType && defenderType === 'Flying' &&
				['Rock', 'Electric', 'Ice'].includes(moveType)) {
				effectiveness *= 1;
			} else {
				effectiveness *= 2;
			}
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			if (hasMindEye && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				effectiveness *= 1;
			} else if (hasScrappy && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				effectiveness *= 1;
			} else {
				effectiveness *= 0;
			}
		}
	}
	return effectiveness;
}

export function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;

	const speciesId = toID(opponentActivePokemon.species);
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 150;

	const ballBonus = getBallBonus(ballId, battle, targetSlot);
	if (ballBonus === 255) return { success: true, shakes: 4 };

	let statusBonus = 1;
	if (opponentStatus === 'slp' || opponentStatus === 'frz') {
		statusBonus = 2.5;
	} else if (opponentStatus === 'par' || opponentStatus === 'psn' || opponentStatus === 'brn') {
		statusBonus = 1.5;
	}

	const { maxHp, hp } = opponentActivePokemon;
	const modifiedCatchRate = catchRate;

	const a = Math.floor(
		(((3 * maxHp - 2 * hp) * modifiedCatchRate * ballBonus) / (3 * maxHp)) * statusBonus
	);

	if (a >= 255) return { success: true, shakes: 4 };

	const b = Math.floor(65536 / (255 / a) ** 0.1875);

	let shakes = 0;
	for (let i = 0; i < 4; i++) {
		const rand = Math.floor(Math.random() * 65536);
		if (rand >= b) {
			return { success: false, shakes };
		}
		shakes++;
	}

	return { success: true, shakes: 4 };
}

export function getBallBonus(ballId: string, battle: BattleState, targetSlot: ActivePokemonSlot): number {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	const playerSlot = getActiveSlots(battle.playerSlots)[0];
	if (!playerSlot) return 1;
	const activePokemon = playerSlot.pokemon;
	const turn = battle.turn;

	const opponentSpecies = Dex.species.get(opponentActivePokemon.species);

	switch (ballId) {
	case 'pokeball': return 1;
	case 'greatball': return 1.5;
	case 'ultraball': return 2;
	case 'masterball': return 255;
	
	// Condition-based balls
	case 'quickball':
		return turn === 0 ? 5 : 1;
	case 'timerball':
		return Math.min(4, 1 + turn * (1229 / 4096));
	case 'repeatball':
		// TODO: Check if player has caught this species before
		return 3.5; // For now, always give bonus
	case 'nestball':
		return opponentActivePokemon.level <= 30 ? Math.max(1, (41 - opponentActivePokemon.level) / 10) : 1;
	case 'duskball':
		// TODO: Check time of day or cave location
		return 3; // For now, always give bonus
	case 'netball':
		return opponentSpecies.types.includes('Bug') || opponentSpecies.types.includes('Water') ? 3.5 : 1;
	case 'diveball':
		// TODO: Check if fishing/surfing encounter
		return 3.5; // For now, always give bonus
	case 'healball':
		return 1; // Same catch rate as Poké Ball, but heals after catch
	
	// Apricorn balls
	case 'fastball':
		return opponentSpecies.baseStats.spe >= 100 ? 4 : 1;
	case 'levelball':
		if (activePokemon.level >= opponentActivePokemon.level * 4) return 8;
		if (activePokemon.level >= opponentActivePokemon.level * 2) return 4;
		if (activePokemon.level > opponentActivePokemon.level) return 2;
		return 1;
	case 'heavyball':
		return opponentActivePokemon.weightkg >= 300 ? 4 :
		       opponentActivePokemon.weightkg >= 200 ? 3 :
		       opponentActivePokemon.weightkg >= 100 ? 2 : 1;
	case 'loveball':
		// TODO: Check if same species, opposite gender
		return 8; // For now, always give bonus
	case 'lureball':
		// TODO: Check if fishing encounter
		return 4; // For now, always give bonus
	case 'moonball':
		// Check if evolves with Moon Stone
		const moonStoneEvolvers = ['nidorina', 'nidorino', 'clefairy', 'jigglypuff', 'skitty', 'munna'];
		return moonStoneEvolvers.includes(toID(opponentActivePokemon.species)) ? 4 : 1;
	case 'friendball':
		return 1; // Same catch rate, but sets friendship to 200
	
	// Premium balls
	case 'luxuryball':
		return 1; // Same catch rate, but increases friendship gain
	case 'premierball':
		return 1; // Same as Poké Ball
	case 'dreamball':
		return opponentStatus === 'slp' ? 4 : 1;
	case 'safariball':
		return 1.5; // Slightly better than Poké Ball
	case 'parkball':
		return 255; // Always catches in special areas
	
	// Special balls
	case 'beastball':
		// TODO: Check if Ultra Beast
		return 5; // For now, give good bonus
	case 'cherishball':
		return 1; // Event ball, same as Poké Ball
	case 'sportball':
		return 1.5; // Bug-Catching Contest ball
	case 'strangeball':
		return 1; // Mysterious ball
	
	default:
		return 1;
	}
}

export function gainExperience(
	player: PlayerData,
	participantSlots: ActivePokemonSlot[],
	defeatedPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
): { messages: string[], leveledUp: boolean } {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId] || 150;

	let leveledUp = false;
	const messages: string[] = [];
	const participantExpGains = new Map<string, number>();

	const opponentLevel = defeatedPokemon.level;
	const X = 2 * opponentLevel + 10;
	const Z = Math.floor((baseExp * opponentLevel) / 5);

	const activeParticipantIds = new Set<string>();
	for (const slot of participantSlots) {
		if (slot?.pokemon && slot.pokemon.hp > 0) {
			activeParticipantIds.add(slot.pokemon.id);
		}
	}

	for (const pokemon of player.party) {
		if (pokemon.level >= GameConfig.levelCap) continue;

		const participantLevel = pokemon.level;
		const Y = opponentLevel + participantLevel + 10;

		const scalingFactor = (Math.sqrt(X) * X * X) / (Math.sqrt(Y) * Y * Y);
		const expGained = Math.floor(scalingFactor * Z) + 1;

		participantExpGains.set(pokemon.species, expGained);

		if (activeParticipantIds.has(pokemon.id)) {
			gainEffortValues(pokemon, defeatedPokemon);
		}

		pokemon.experience += expGained;
	}

	if (participantExpGains.size === 0) return { messages: [], leveledUp: false };

	if (participantExpGains.size === 1) {
		const [species, exp] = Array.from(participantExpGains.entries())[0];
		messages.push(`<b>${species} gained ${exp} Experience Points!</b>`);
	} else {
		const expValues = Array.from(participantExpGains.values());
		const allSame = expValues.every(v => v === expValues[0]);

		if (allSame) {
			const participantNames = Array.from(participantExpGains.keys());
			messages.push(`<b>${participantNames.join(' and ')} gained ${expValues[0]} Experience Points!</b>`);
		} else {
			const expStrings = Array.from(participantExpGains.entries()).map(([name, exp]) =>
				`${name} gained ${exp} Experience Points`
			);
			messages.push(`<b>${expStrings.join(' and ')}!</b>`);
		}
	}

	for (const pokemon of player.party) {
		if (pokemon.level >= GameConfig.levelCap) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < GameConfig.levelCap) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, { room, user });
			if (evolveMessage) {
				messages.push(evolveMessage);
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}
	}

	return { messages, leveledUp };
}

export function gainEffortValues(pokemon: RPGPokemon, defeatedPokemon: RPGPokemon) {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	const evYield = MANUAL_EV_YIELDS[defeatedSpeciesId] || { atk: 1 };

	let totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	for (const stat in evYield) {
		if (totalEVs >= 510) break;
		const statKey = stat as keyof Stats;
		const evGained = evYield[statKey]!;
		const currentEV = pokemon.evs[statKey];
		if (currentEV >= 252) continue;
		const canAdd = Math.min(evGained, 252 - currentEV, 510 - totalEVs);
		pokemon.evs[statKey] += canAdd;
		totalEVs += canAdd;
	}
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	pokemon.hp = Math.max(1, pokemon.hp + hpDiff);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
}

export function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);
	const playerParty = getActiveParty(battle, player);

	for (const slot of battle.playerSlots) {
		if (slot) {
			const pokemonInParty = playerParty.find(p => p.id === slot.pokemon.id);
			if (pokemonInParty) {
				if (slot.status === 'slp' || slot.status === 'frz') {
					pokemonInParty.status = null;
				} else {
					pokemonInParty.status = slot.status;
				}
			}
		}
	}

	if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
		for (const slot of battle.opponentSlots) {
			if (slot) {
				const opponentPokemonInParty = battle.opponentParty.find(p => p.id === slot.pokemon.id);
				if (opponentPokemonInParty) {
					opponentPokemonInParty.status = slot.status;
				}
			}
		}
	}
}
