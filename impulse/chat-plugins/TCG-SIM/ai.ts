/**
 * ai.ts — Smart AI for the Pokémon TCG Simulator
 *
 * Separated from engine.ts and dramatically upgraded from the original stub.
 * The AI models the GBC game's decision-making: it evaluates board state,
 * uses trainers aggressively (including disruption), manages energy correctly,
 * and picks attacks based on KO potential and prize economy.
 *
 * Integration: replace the `executeAITurn()` body in engine.ts with:
 *   import { executeAITurn } from './ai';
 *   // then in TCGMatch:
 *   executeAITurn(this);
 */

import type { TCGMatch, PokemonInstance, InGameCard } from './engine';
import {
    isBasicPokemon,
    isEvolutionPokemon,
    isEnergyCard,
    isTrainerCard,
    hasEnoughEnergy,
    flipCoin,
} from './engine';
import { TrainerEffects } from './effects';
import { getPowerRequirements } from './power-effects';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AttackOption {
    index: number;
    name: string;
    expectedDamage: number;
    koesActive: boolean;
    koesBench: boolean;
    hasEnough: boolean;
}

interface ScoredAction {
    score: number;
    label: string;
    execute: () => void;
}

// ---------------------------------------------------------------------------
// Board evaluation helpers
// ---------------------------------------------------------------------------

/** How many prizes the AI would take for knocking out this card. */
function prizeValue(inst: PokemonInstance): number {
    const sub = inst.topCard.subtypes ?? [];
    if (sub.some(s => ['GX', 'EX', 'VMAX', 'VSTAR', 'V'].includes(s))) return 2;
    if (inst.topCard.rules?.some(r => r.toLowerCase().includes('prize'))) return 2;
    return 1;
}

/** HP remaining on an instance. */
function hpLeft(inst: PokemonInstance): number {
    return Math.max(0, inst.maxHP - inst.currentDamage);
}

/**
 * Estimate final damage the AI's attacker will do to a defender,
 * including weakness/resistance but NOT PlusPower (handled separately).
 */
function estimateDamage(
    match: TCGMatch,
    attackerInst: PokemonInstance,
    defenderInst: PokemonInstance,
    attackIndex: number
): number {
    const atk = attackerInst.topCard.attacks?.[attackIndex];
    if (!atk) return 0;
    const raw = parseInt(atk.damage.replace(/[^0-9]/g, ''));
    const base = isNaN(raw) ? 0 : raw;
    if (base === 0) return 0;

    const { final } = match.computeFinalDamage(
        base,
        attackerInst.topCard.types ?? [],
        attackerInst,
        defenderInst,
        true
    );
    return final;
}

/**
 * Return the best attack option for the AI's active against the player's active.
 * Scores: KO > most damage > lowest energy cost.
 */
function evaluateAttacks(
    match: TCGMatch,
    attackerInst: PokemonInstance,
    defenderInst: PokemonInstance
): AttackOption[] {
    const attacks = attackerInst.topCard.attacks ?? [];
    const options: AttackOption[] = [];

    for (let i = 0; i < attacks.length; i++) {
        const atk = attacks[i];
        const hasEnough = hasEnoughEnergy(attackerInst, i);
        const expectedDmg = hasEnough ? estimateDamage(match, attackerInst, defenderInst, i) : 0;
        const koesActive = expectedDmg >= hpLeft(defenderInst);

        // Check if any bench Pokémon would be KO'd by spread damage
        // (for attacks that do bench damage — rough heuristic)
        const koesBench = false; // would need to simulate bench spread

        options.push({
            index: i,
            name: atk.name,
            expectedDamage: expectedDmg,
            koesActive,
            koesBench,
            hasEnough,
        });
    }

    // Sort: KO first, then by damage descending, then by cost ascending
    options.sort((a, b) => {
        if (a.koesActive !== b.koesActive) return a.koesActive ? -1 : 1;
        if (a.expectedDamage !== b.expectedDamage) return b.expectedDamage - a.expectedDamage;
        const costA = attackerInst.topCard.attacks![a.index].cost?.length ?? 0;
        const costB = attackerInst.topCard.attacks![b.index].cost?.length ?? 0;
        return costA - costB;
    });

    return options;
}

/** Pick the best bench slot for retreat (highest effective HP after retreating in). */
function bestRetreatTarget(match: TCGMatch): number {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < match.ai.bench.length; i++) {
        const b = match.ai.bench[i];
        if (!b) continue;
        // Score = remaining HP + energy already attached (to prefer ready attackers)
        const score = hpLeft(b) + b.attachedEnergy.length * 20;
        if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
        }
    }
    return bestIdx;
}

/** True if the AI's active is in danger of being KO'd next turn. */
function activeIsInDanger(match: TCGMatch): boolean {
    const active = match.ai.active;
    if (!active) return false;
    const playerActive = match.player.active;
    if (!playerActive) return false;

    // Estimate max damage the player can do
    const attacks = playerActive.topCard.attacks ?? [];
    for (let i = 0; i < attacks.length; i++) {
        if (!hasEnoughEnergy(playerActive, i)) continue;
        const dmg = estimateDamage(match, playerActive, active, i);
        if (dmg >= hpLeft(active)) return true;
    }
    return false;
}

/** True if the given Pokémon can be KO'd by a single hit from the player. */
function wouldBeKOd(match: TCGMatch, inst: PokemonInstance): boolean {
    const playerActive = match.player.active;
    if (!playerActive) return false;
    const attacks = playerActive.topCard.attacks ?? [];
    for (let i = 0; i < attacks.length; i++) {
        if (!hasEnoughEnergy(playerActive, i)) continue;
        const dmg = estimateDamage(match, playerActive, inst, i);
        if (dmg >= hpLeft(inst)) return true;
    }
    return false;
}

// ---------------------------------------------------------------------------
// Trainer decision helpers
// ---------------------------------------------------------------------------

/**
 * Score how valuable playing a specific trainer is right now.
 * Higher = more urgent.
 */
function scoreTrainer(match: TCGMatch, card: InGameCard): number {
    const name = card.name;
    const ai = match.ai;
    const player = match.player;

    switch (name) {
        // ── Draw engines ────────────────────────────────────────────────────
        case 'Professor Oak':
            // Very valuable if hand is small or deck is large
            if (ai.hand.length <= 3) return 95;
            if (ai.hand.length <= 5) return 60;
            return 30;

        case 'Bill':
            if (ai.hand.length <= 2) return 80;
            if (ai.hand.length <= 4) return 50;
            return 20;

        case 'Impostor Professor Oak':
            // Good when player has a big hand
            if (player.hand.length >= 6) return 85;
            if (player.hand.length >= 4) return 55;
            return 15;

        case 'Lass':
            // Good when player has many trainers; also removes our own if hand full
            {
                const playerTrainers = player.hand.filter(c => isTrainerCard(c)).length;
                if (playerTrainers >= 3) return 70;
                return 10;
            }

        // ── Healing ─────────────────────────────────────────────────────────
        case 'Pokémon Center':
            {
                const totalDamage = ai.getAllInPlay().reduce((s, i) => s + i.currentDamage, 0);
                // Worth it only if total energy loss is acceptable
                const totalEnergy = ai.getAllInPlay().reduce((s, i) => s + i.attachedEnergy.length, 0);
                if (totalDamage >= 60 && totalEnergy <= 2) return 75;
                if (totalDamage >= 40) return 40;
                return 0;
            }

        case 'Full Heal':
            {
                const active = ai.active;
                if (!active) return 0;
                const hasStatus = active.status.volatile !== null || active.status.poisoned || active.status.burned;
                if (!hasStatus) return 0;
                if (active.status.volatile === 'paralyzed') return 90; // can't attack
                if (active.status.volatile === 'asleep') return 80;
                if (active.status.poisoned) return 50;
                return 35;
            }

        // ── Disruption ──────────────────────────────────────────────────────
        case 'Gust of Wind':
            {
                // Pull out a damaged or low-HP bench Pokémon
                const targets = player.bench.filter(b => b !== null) as PokemonInstance[];
                if (!targets.length) return 0;
                const bestTarget = targets.reduce((best, t) =>
                    hpLeft(t) < hpLeft(best) ? t : best
                );
                const activeHP = player.active ? hpLeft(player.active) : 999;
                // Very good if there's a nearly-dead benched Pokémon
                if (hpLeft(bestTarget) < 40) return 88;
                if (hpLeft(bestTarget) < activeHP - 20) return 60;
                return 15;
            }

        case 'Energy Removal':
            {
                const oppActive = player.active;
                if (!oppActive || oppActive.attachedEnergy.length === 0) return 0;
                // More valuable if opponent is close to attacking
                const neededForAttack = oppActive.topCard.attacks?.reduce(
                    (min, a) => Math.min(min, a.cost?.length ?? 0), 999
                ) ?? 0;
                if (oppActive.attachedEnergy.length >= neededForAttack) return 72;
                if (oppActive.attachedEnergy.length >= 2) return 50;
                return 30;
            }

        case 'Super Energy Removal': {
            const oppActive = player.active;
            if (!oppActive || oppActive.attachedEnergy.length < 2) return 0;
            const selfHasEnergy = ai.getAllInPlay().some(i => i.attachedEnergy.length > 0);
            if (!selfHasEnergy) return 0;
            if (oppActive.attachedEnergy.length >= 3) return 85;
            return 55;
        }

        case 'Pokémon Flute': {
            // Pull a nearly-dead Pokémon from opponent's discard onto their bench
            // Only useful if we have a spread attacker — otherwise moderate value
            const basics = player.discard.filter(c => isBasicPokemon(c));
            if (!basics.length) return 0;
            // The idea is to give us a prize target — but it also gives opponent a Pokémon
            // Only worth it if opponent is about to deck out or lose to bench limit
            if (player.bench.every(b => b !== null)) return 0; // bench full, can't place
            return 20;
        }

        // ── Recovery ────────────────────────────────────────────────────────
        case 'Revive': {
            const hasBench = ai.bench.some(b => b !== null);
            const discardedBasics = ai.discard.filter(c => isBasicPokemon(c));
            if (!discardedBasics.length) return 0;
            if (!hasBench || ai.firstEmptyBenchSlot() === -1) return 0;
            return 45;
        }

        case 'Scoop Up': {
            const active = ai.active;
            if (!active) return 0;
            if (!isBasicPokemon(active.cards[0])) return 0;
            // Good if active is heavily damaged and we have a better option
            const dangerThreshold = active.maxHP * 0.25;
            if (hpLeft(active) <= dangerThreshold && ai.bench.some(b => b !== null)) return 78;
            return 0;
        }

        // ── Stat items (handled in attach phase, not here) ───────────────────
        case 'Defender':
        case 'PlusPower':
            return 0; // Handled in attachItem logic

        // ── Utility ─────────────────────────────────────────────────────────
        case 'Switch': {
            const active = ai.active;
            if (!active) return 0;
            const hasBench = ai.bench.some(b => b !== null);
            if (!hasBench) return 0;
            // Good if active is asleep/paralyzed or in danger
            if (active.status.volatile === 'paralyzed' || active.status.volatile === 'asleep') return 82;
            if (activeIsInDanger(match) && bestRetreatTarget(match) !== -1) return 60;
            if (active.retreatCostCount > 1) return 25; // save energy
            return 5;
        }

        case 'Pokémon Breeder': {
            const stage2s = ai.hand.filter(c => c.subtypes?.includes('Stage 2'));
            for (const s2 of stage2s) {
                const slots: ('active' | number)[] = ['active', 0, 1, 2, 3, 4];
                for (const slot of slots) {
                    const inst = slot === 'active' ? ai.active : ai.bench[slot as number];
                    if (!inst) continue;
                    // Would this Stage 2 be placeable (skip stage check)?
                    if (inst.stage === 0 && inst.turnPlaced < match.turnNumber) return 70;
                }
            }
            return 0;
        }

        case 'Devolution Spray': {
            // Rarely useful for AI — only if opponent just evolved
            return 5;
        }

        case 'Computer Search':
        case 'Item Finder':
        case 'Maintenance':
        case 'Pokémon Trader':
        case 'Energy Retrieval':
            return 35; // AI auto-handles these simply

        case 'Pokédex':
            return 10;

        default:
            return 0;
    }
}

/** Find the best bench slot for Gust of Wind (lowest HP enemy bench Pokémon). */
function gustOfWindTarget(match: TCGMatch): number {
    let bestIdx = -1;
    let lowestHP = Infinity;
    for (let i = 0; i < match.player.bench.length; i++) {
        const b = match.player.bench[i];
        if (!b) continue;
        if (hpLeft(b) < lowestHP) {
            lowestHP = hpLeft(b);
            bestIdx = i;
        }
    }
    return bestIdx;
}

/** Find the best target slot for Potion/Super Potion on AI's field. */
function bestHealTarget(match: TCGMatch, minDamage: number): 'active' | number {
    let bestSlot: 'active' | number = 'active';
    let mostDamage = -1;

    const active = match.ai.active;
    if (active && active.currentDamage >= minDamage) {
        mostDamage = active.currentDamage;
        bestSlot = 'active';
    }
    for (let i = 0; i < match.ai.bench.length; i++) {
        const b = match.ai.bench[i];
        if (b && b.currentDamage >= minDamage && b.currentDamage > mostDamage) {
            mostDamage = b.currentDamage;
            bestSlot = i;
        }
    }
    return bestSlot;
}

/** Find which of AI's own Pokémon has the most expendable energy. */
function ownEnergySourceForSER(match: TCGMatch): { instUid: number; eIdx: number } | null {
    for (const inst of match.ai.getAllInPlay()) {
        // Don't strip energy if it's needed to attack
        const atk = inst.topCard.attacks ?? [];
        const minCost = atk.reduce((mn, a) => Math.min(mn, a.cost?.length ?? 0), 999);
        if (inst.attachedEnergy.length > minCost) {
            return { instUid: inst.uid, eIdx: inst.attachedEnergy.length - 1 };
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// Item attachment logic (PlusPower, Defender)
// ---------------------------------------------------------------------------

/**
 * Decide whether to attach PlusPower or Defender to a specific Pokémon,
 * and execute it. Returns true if an item was played.
 */
function tryPlayItemTrainer(match: TCGMatch): boolean {
    const ai = match.ai;
    const playerActive = match.player.active;
    const aiActive = match.ai.active;

    // ── PlusPower: play if it lets us KO the opponent's active ──────────────
    const plusPowers = ai.hand.filter(c => c.name === 'PlusPower');
    if (plusPowers.length > 0 && aiActive && playerActive) {
        for (let i = 0; i < (aiActive.topCard.attacks?.length ?? 0); i++) {
            if (!hasEnoughEnergy(aiActive, i)) continue;
            const dmg = estimateDamage(match, aiActive, playerActive, i);
            const needed = hpLeft(playerActive);
            // With one PlusPower (+10), would we KO?
            if (dmg + 10 >= needed && dmg < needed) {
                const card = plusPowers[0] as InGameCard;
                match.playTrainer(false, card.uid, 'active');
                match.addLog(`AI played PlusPower on ${aiActive.topCard.name} to secure a KO!`);
                return true;
            }
        }
    }

    // ── Defender: play if AI's active will be KO'd and we want to survive ───
    const defenders = ai.hand.filter(c => c.name === 'Defender');
    if (defenders.length > 0 && aiActive && activeIsInDanger(match)) {
        // Check if Defender (-20) would save us
        const playerActive2 = match.player.active;
        if (playerActive2) {
            const attacks = playerActive2.topCard.attacks ?? [];
            for (let i = 0; i < attacks.length; i++) {
                if (!hasEnoughEnergy(playerActive2, i)) continue;
                const dmg = estimateDamage(match, playerActive2, aiActive, i);
                if (dmg >= hpLeft(aiActive) && dmg - 20 < hpLeft(aiActive)) {
                    // Defender would save us
                    const card = defenders[0] as InGameCard;
                    match.playTrainer(false, card.uid, 'active');
                    match.addLog(`AI played Defender on ${aiActive.topCard.name} to survive!`);
                    return true;
                }
            }
        }
    }

    return false;
}

// ---------------------------------------------------------------------------
// Pokemon placement & evolution
// ---------------------------------------------------------------------------

function handlePlacementAndEvolution(match: TCGMatch): void {
    const ai = match.ai;

    // Promote if needed
    if (ai.pendingPromotion) {
        const benchIdx = ai.bench.findIndex(b => b !== null);
        if (benchIdx !== -1) {
            match.promote(false, benchIdx);
        } else {
            const basic = ai.hand.find(c => isBasicPokemon(c));
            if (basic) match.playBasicPokemon(false, (basic as InGameCard).uid, 'active');
            else {
                match.addLog('AI has no Pokémon to promote.');
                return;
            }
        }
    }

    // Bench basics (prefer higher HP)
    const basicsInHand = ai.hand
        .filter(c => isBasicPokemon(c))
        .sort((a, b) => parseInt(b.hp || '0') - parseInt(a.hp || '0'));

    for (const card of basicsInHand) {
        const slot = ai.firstEmptyBenchSlot();
        if (slot === -1) break;
        match.playBasicPokemon(false, (card as InGameCard).uid, slot);
    }

    // Evolve — prefer evolving the active first (higher priority), then bench
    const evolutions = ai.hand.filter(c => isEvolutionPokemon(c));
    for (const card of evolutions) {
        const evFrom = card.evolvesFrom;
        if (!evFrom) continue;

        // Try active first
        if (ai.active?.topCard.name === evFrom && ai.active.turnPlaced < match.turnNumber) {
            match.evolvePokemon(false, (card as InGameCard).uid, 'active');
            continue;
        }
        // Try bench
        for (let i = 0; i < 5; i++) {
            const b = ai.bench[i];
            if (b?.topCard.name === evFrom && b.turnPlaced < match.turnNumber) {
                match.evolvePokemon(false, (card as InGameCard).uid, i);
                break;
            }
        }
    }

    // Pokémon Breeder: evolve basic directly to stage 2
    const stage2s = ai.hand.filter(c => c.subtypes?.includes('Stage 2'));
    for (const s2 of stage2s) {
        const slots: ('active' | number)[] = ['active', 0, 1, 2, 3, 4];
        for (const slot of slots) {
            if (match.evolvePokemon(false, (s2 as InGameCard).uid, slot, true)) break;
        }
    }
}

// ---------------------------------------------------------------------------
// Energy attachment logic
// ---------------------------------------------------------------------------

function handleEnergyAttachment(match: TCGMatch): void {
    if (match.hasAttachedEnergy) return;
    const ai = match.ai;
    if (!ai.active) return;

    const energyInHand = ai.hand.filter(c => isEnergyCard(c)) as InGameCard[];
    if (!energyInHand.length) return;

    // Priority: attach to whoever is closest to being able to attack
    // Specifically the active, or a benched Pokémon that's one energy away

    // Score all possible attachment targets
    const allInPlay = ai.getAllInPlay();

    let bestCard: InGameCard | null = null;
    let bestTarget: 'active' | number = 'active';
    let bestScore = -Infinity;

    for (const eCard of energyInHand) {
        for (let si = 0; si < allInPlay.length; si++) {
            const inst = allInPlay[si];
            const slot: 'active' | number = inst === ai.active ? 'active' : ai.bench.findIndex(b => b?.uid === inst.uid);
            if (slot === -1) continue;

            let score = inst === ai.active ? 30 : 0; // prefer active

            // How many energy short of cheapest attack?
            const attacks = inst.topCard.attacks ?? [];
            const minCost = attacks.reduce((mn, a, i) => {
                if (!hasEnoughEnergy(inst, i)) {
                    return Math.min(mn, (a.cost?.length ?? 0) - inst.attachedEnergy.length);
                }
                return mn;
            }, 999);

            if (minCost <= 1) score += 50; // one energy away from attacking
            if (minCost === 0) score += 20; // already can attack, still good to power up

            // Prefer Pokémon with more HP remaining (don't waste on dying Pokémon)
            score += hpLeft(inst) / 10;

            // Match energy type to Pokémon type if possible
            const instType = inst.topCard.types?.[0] ?? '';
            const eType = eCard.name.replace(' Energy', '');
            if (eType === instType || eCard.name === 'Double Colorless Energy') score += 20;

            if (score > bestScore) {
                bestScore = score;
                bestCard = eCard;
                bestTarget = slot;
            }
        }
    }

    if (bestCard) {
        match.attachEnergy(false, bestCard.uid, bestTarget);
    }
}

// ---------------------------------------------------------------------------
// Trainer play logic
// ---------------------------------------------------------------------------

function handleTrainers(match: TCGMatch): void {
    const ai = match.ai;
    const MAX_TRAINER_PLAYS = 6; // avoid infinite loops
    let plays = 0;

    while (plays < MAX_TRAINER_PLAYS) {
        plays++;

        // Score all trainers in hand
        const trainers = ai.hand.filter(c => isTrainerCard(c)) as InGameCard[];
        if (!trainers.length) break;

        // Build list of scored actions
        const actions: ScoredAction[] = [];

        for (const card of trainers) {
            const effect = TrainerEffects[card.id] ?? TrainerEffects[card.name];
            if (!effect) continue;

            const sc = scoreTrainer(match, card);
            if (sc <= 0) continue;

            // ── Untargeted trainers ─────────────────────────────────────────
            if (!effect.requiresTarget || !effect.opponentTarget) {
                switch (card.name) {
                    case 'Bill':
                    case 'Professor Oak':
                    case 'Impostor Professor Oak':
                    case 'Lass':
                    case 'Full Heal':
                    case 'Pokémon Center':
                        actions.push({
                            score: sc,
                            label: card.name,
                            execute: () => { match.playTrainer(false, card.uid); }
                        });
                        break;

                    case 'Switch': {
                        const tgt = bestRetreatTarget(match);
                        if (tgt !== -1) {
                            actions.push({
                                score: sc,
                                label: 'Switch',
                                execute: () => { match.playTrainer(false, card.uid, tgt); }
                            });
                        }
                        break;
                    }

                    case 'Scoop Up': {
                        // Scoop up the active if it's nearly dead
                        const active = ai.active;
                        if (active && isBasicPokemon(active.cards[0])) {
                            actions.push({
                                score: sc,
                                label: 'Scoop Up (active)',
                                execute: () => { match.playTrainer(false, card.uid, 'active'); }
                            });
                        }
                        break;
                    }

                    case 'Pokémon Breeder': {
                        const stage2 = ai.hand.find(c => c.subtypes?.includes('Stage 2'));
                        if (!stage2) break;
                        for (const slot of ['active', 0, 1, 2, 3, 4] as ('active' | number)[]) {
                            const inst = slot === 'active' ? ai.active : ai.bench[slot as number];
                            if (!inst || inst.stage !== 0 || inst.turnPlaced >= match.turnNumber) continue;
                            actions.push({
                                score: sc,
                                label: 'Pokémon Breeder',
                                execute: () => { match.playTrainer(false, card.uid); }
                            });
                            break;
                        }
                        break;
                    }

                    case 'Computer Search':
                    case 'Item Finder':
                    case 'Maintenance':
                    case 'Pokémon Trader':
                    case 'Energy Retrieval':
                    case 'Pokédex':
                        if (ai.hand.length >= 2) {
                            actions.push({
                                score: sc,
                                label: card.name,
                                execute: () => { match.playTrainer(false, card.uid); }
                            });
                        }
                        break;

                    case 'Revive': {
                        const discBasics = ai.discard
                            .map((c, i) => ({ c, i }))
                            .filter(({ c }) => isBasicPokemon(c));
                        if (!discBasics.length || ai.firstEmptyBenchSlot() === -1) break;
                        actions.push({
                            score: sc,
                            label: 'Revive',
                            execute: () => { match.playTrainer(false, card.uid, discBasics[0].i); }
                        });
                        break;
                    }
                }
            }

            // ── Targeted trainers (own field) ───────────────────────────────
            if (effect.requiresTarget && !effect.opponentTarget) {
                switch (card.name) {
                    case 'Potion': {
                        const tgt = bestHealTarget(match, 20);
                        const inst = tgt === 'active' ? ai.active : ai.bench[tgt as number];
                        if (inst && inst.currentDamage >= 20) {
                            actions.push({
                                score: sc,
                                label: 'Potion',
                                execute: () => { match.playTrainer(false, card.uid, tgt); }
                            });
                        }
                        break;
                    }

                    case 'Super Potion': {
                        const tgt = bestHealTarget(match, 40);
                        const inst = tgt === 'active' ? ai.active : ai.bench[tgt as number];
                        if (inst && inst.currentDamage >= 40 && inst.attachedEnergy.length > 0) {
                            actions.push({
                                score: sc,
                                label: 'Super Potion',
                                execute: () => { match.playTrainer(false, card.uid, tgt); }
                            });
                        }
                        break;
                    }

                    case 'Devolution Spray': {
                        // Only useful vs evolved Pokémon — skip for AI for now
                        break;
                    }
                }
            }

            // ── Targeted trainers (opponent's field) ─────────────────────────
            if (effect.requiresTarget && effect.opponentTarget) {
                switch (card.name) {
                    case 'Gust of Wind': {
                        const tgt = gustOfWindTarget(match);
                        if (tgt !== -1) {
                            actions.push({
                                score: sc,
                                label: 'Gust of Wind',
                                execute: () => { match.playTrainer(false, card.uid, tgt); }
                            });
                        }
                        break;
                    }

                    case 'Energy Removal': {
                        const playerActive = match.player.active;
                        if (playerActive && playerActive.attachedEnergy.length > 0) {
                            actions.push({
                                score: sc,
                                label: 'Energy Removal (active)',
                                execute: () => { match.playTrainer(false, card.uid, 'active'); }
                            });
                        }
                        break;
                    }

                    case 'Super Energy Removal': {
                        const src = ownEnergySourceForSER(match);
                        const playerActive = match.player.active;
                        if (!src || !playerActive || playerActive.attachedEnergy.length < 2) break;
                        // Use SER directly — AI path in effect.ts handles it automatically
                        actions.push({
                            score: sc,
                            label: 'Super Energy Removal',
                            execute: () => { match.playTrainer(false, card.uid, 'active'); }
                        });
                        break;
                    }

                    case 'Pokémon Flute': {
                        const basics = match.player.discard
                            .map((c, i) => ({ c, i }))
                            .filter(({ c }) => isBasicPokemon(c));
                        if (!basics.length || match.player.firstEmptyBenchSlot() === -1) break;
                        // Place the weakest basic from opponent's discard
                        const weakest = basics.reduce((b, t) =>
                            parseInt(t.c.hp || '0') < parseInt(b.c.hp || '0') ? t : b
                        );
                        actions.push({
                            score: sc,
                            label: 'Pokémon Flute',
                            execute: () => { match.playTrainer(false, card.uid, weakest.i); }
                        });
                        break;
                    }
                }
            }
        }

        if (!actions.length) break;

        // Execute the highest-scoring action
        actions.sort((a, b) => b.score - a.score);
        const best = actions[0];
        const handBefore = ai.hand.length;
        best.execute();
        // If hand didn't change (effect returned false / pending), stop to avoid loop
        if (ai.hand.length === handBefore) break;
    }
}

// ---------------------------------------------------------------------------
// Pokémon Power usage
// ---------------------------------------------------------------------------

function handlePokemonPowers(match: TCGMatch): void {
    let powerUsed = true;
    let loops = 0;

    while (powerUsed && loops < 8 && !match.winner) {
        powerUsed = false;
        loops++;

        for (const inst of match.ai.getAllInPlay()) {
            if (inst.isPowerBlocked()) continue;

            for (let pIdx = 0; pIdx < (inst.topCard.abilities?.length ?? 0); pIdx++) {
                const power = inst.topCard.abilities![pIdx];
                if (power.type !== 'Pokémon Power' && power.type !== 'Poké-Power') continue;

                const reqs = getPowerRequirements(power);
                if (!reqs) continue;

                if (reqs.filter === 'rain_dance_energy') {
                    // Attach all available Water Energy to Water Pokémon
                    const waterIdx = match.ai.hand.findIndex(c => c.name === 'Water Energy');
                    if (waterIdx === -1) continue;

                    // Target: prefer active water type, then bench water type
                    const allWater = match.ai.getAllInPlay().filter(i => i.topCard.types?.includes('Water'));
                    if (!allWater.length) continue;

                    // Find the one furthest from being able to attack
                    const target = allWater.reduce((best, t) => {
                        const bCost = best.topCard.attacks?.reduce((mn, a, i) =>
                            hasEnoughEnergy(best, i) ? mn : Math.min(mn, a.cost?.length ?? 0), 999) ?? 0;
                        const tCost = t.topCard.attacks?.reduce((mn, a, i) =>
                            hasEnoughEnergy(t, i) ? mn : Math.min(mn, a.cost?.length ?? 0), 999) ?? 0;
                        return tCost > bCost ? t : best;
                    });

                    const slot: 'active' | number = target === match.ai.active
                        ? 'active'
                        : match.ai.bench.findIndex(b => b?.uid === target.uid);

                    if (match.usePokemonPower(false, inst.uid, pIdx, {
                        energyUid: (match.ai.hand[waterIdx] as InGameCard).uid,
                        targetSlot: slot
                    })) {
                        powerUsed = true;
                    }

                } else if (reqs.filter === 'damage_swap_from') {
                    // Move damage off active onto a healthy bench Pokémon
                    const active = match.ai.active;
                    if (!active || active.currentDamage < 10) continue;

                    const healthyBench = match.ai.bench
                        .filter((b): b is PokemonInstance => !!b && b.currentDamage === 0 && b.maxHP >= 50)
                        .sort((a, b) => b.maxHP - a.maxHP)[0];

                    if (!healthyBench) continue;

                    if (match.usePokemonPower(false, inst.uid, pIdx, {
                        fromUid: active.uid,
                        toUid: healthyBench.uid
                    })) {
                        powerUsed = true;
                    }

                } else if (reqs.filter === 'energy_trans_from') {
                    // Move Grass Energy to the active or most energy-hungry Pokémon
                    const destination = match.ai.active;
                    if (!destination) continue;

                    const benchedWithGrass = match.ai.bench.find(b =>
                        b && b.uid !== destination.uid &&
                        b.attachedEnergy.some(e => e.name === 'Grass Energy')
                    );
                    if (!benchedWithGrass) continue;

                    const grassEnergy = benchedWithGrass.attachedEnergy.find(e => e.name === 'Grass Energy');
                    if (!grassEnergy) continue;

                    if (match.usePokemonPower(false, inst.uid, pIdx, {
                        energyUid: (grassEnergy as InGameCard).uid,
                        fromUid: benchedWithGrass.uid,
                        toUid: destination.uid
                    })) {
                        powerUsed = true;
                    }

                } else if (reqs.filter === 'lure_energy') {
                    // Lure: discard Fire Energy, pull weak opponent bench Pokémon
                    const fireIdx = match.ai.hand.findIndex(c => c.name === 'Fire Energy');
                    if (fireIdx === -1) continue;

                    // Find the opponent bench Pokémon with least HP
                    let weakestBenchIdx = -1;
                    let lowestHP = Infinity;
                    for (let bi = 0; bi < match.player.bench.length; bi++) {
                        const b = match.player.bench[bi];
                        if (!b) continue;
                        if (hpLeft(b) < lowestHP) {
                            lowestHP = hpLeft(b);
                            weakestBenchIdx = bi;
                        }
                    }
                    if (weakestBenchIdx === -1) continue;

                    if (match.usePokemonPower(false, inst.uid, pIdx, {
                        energyUid: (match.ai.hand[fireIdx] as InGameCard).uid,
                        benchIndex: weakestBenchIdx
                    })) {
                        powerUsed = true;
                    }

                } else if (reqs.filter === 'energy_burn_from' || (reqs.needed === 0 &&
                    power.name !== 'Strikes Back' && power.name !== 'Invisible Wall')) {
                    // Generic zero-requirement powers
                    if (match.usePokemonPower(false, inst.uid, pIdx, {})) {
                        powerUsed = true;
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Retreat logic
// ---------------------------------------------------------------------------

function handleRetreat(match: TCGMatch): void {
    const ai = match.ai;
    const active = ai.active;
    if (!active) return;
    if (ai.hasRetreatedThisTurn) return;

    const vol = active.status.volatile;

    // Never retreat if asleep or paralyzed (can't — but don't try)
    if (vol === 'asleep' || vol === 'paralyzed') return;

    const inDanger = activeIsInDanger(match);
    const bestBench = bestRetreatTarget(match);
    if (bestBench === -1) return;

    const benchTarget = ai.bench[bestBench];
    if (!benchTarget) return;

    // Only retreat if the bench target is meaningfully better
    const retreatWorthIt =
        inDanger ||
        (vol === 'confused' && benchTarget.attachedEnergy.length >= 1) ||
        (active.currentDamage >= active.maxHP * 0.75 && hpLeft(benchTarget) > hpLeft(active) + 20);

    if (!retreatWorthIt) return;

    const cost = active.retreatCostCount;
    if (active.attachedEnergy.length < cost) return;

    // Remove retreat cost energy
    for (let i = 0; i < cost; i++) {
        ai.discard.push(active.attachedEnergy.pop()!);
    }

    active.clearVolatileStatus();
    ai.active = benchTarget;
    ai.bench[bestBench] = active;
    ai.hasRetreatedThisTurn = true;
    match.addLog(`AI retreated ${active.topCard.name}, sending out ${benchTarget.topCard.name}.`);
}

// ---------------------------------------------------------------------------
// Attack selection
// ---------------------------------------------------------------------------

function handleAttack(match: TCGMatch): boolean {
    if (match.winner) return false;
    const ai = match.ai;
    const aiActive = ai.active;
    const playerActive = match.player.active;

    if (!aiActive || !playerActive) return false;

    const vol = aiActive.status.volatile;
    if (vol === 'asleep' || vol === 'paralyzed') return false;

    const options = evaluateAttacks(match, aiActive, playerActive);
    const usable = options.filter(o => o.hasEnough);
    if (!usable.length) return false;

    // Pick: prefer KO attacks, then highest damage
    const chosen = usable[0];

    // Extra logging for strategic decisions
    if (chosen.koesActive) {
        match.addLog(`AI targets a KO with ${chosen.name} (${chosen.expectedDamage} dmg vs ${hpLeft(playerActive)} HP).`);
    }

    return match.attack(false, chosen.index);
}

// ---------------------------------------------------------------------------
// Main AI turn entry point
// ---------------------------------------------------------------------------

export function executeAITurn(match: TCGMatch): void {
    if (match.winner) return;

    match.addLog(`AI's turn (turn ${match.turnNumber}).`);
    match.turnNumber++;

    // 1. Draw
    if (!match.ai.draw(1)) {
        // AI ran out of cards — declared in draw() indirectly; engine handles winner
        match.addLog('AI ran out of cards!');
        // The engine's declareWinner is called from draw path; need to trigger it:
        (match as any).declareWinner?.(true, 'AI ran out of cards');
        return;
    }

    // 2. Promote if needed (active was KO'd)
    handlePlacementAndEvolution(match);
    if (match.winner) return;

    // 3. Draw-engine trainers first (to get more cards before other decisions)
    const drawTrainers = ['Professor Oak', 'Bill', 'Impostor Professor Oak'];
    for (const name of drawTrainers) {
        const card = match.ai.hand.find(c => isTrainerCard(c) && c.name === name) as InGameCard | undefined;
        if (card) {
            const effect = TrainerEffects[card.id] ?? TrainerEffects[card.name];
            if (effect && !effect.requiresTarget) match.playTrainer(false, card.uid);
        }
    }
    if (match.winner) return;

    // 4. Use Pokémon Powers
    handlePokemonPowers(match);
    if (match.winner) return;

    // 5. Play item trainers (PlusPower, Defender) — before attack evaluation
    tryPlayItemTrainer(match);
    if (match.winner) return;

    // 6. Attach Energy — before playing targeted trainers so we know our state
    handleEnergyAttachment(match);
    if (match.winner) return;

    // 7. Play all remaining trainers in priority order
    handleTrainers(match);
    if (match.winner) return;

    // 8. Place any new basics / evolve again after drawing/searching
    handlePlacementAndEvolution(match);
    if (match.winner) return;

    // 9. Consider retreating if in danger
    handleRetreat(match);
    if (match.winner) return;

    // 10. Attack
    const attacked = handleAttack(match);
    if (match.winner) return;

    // 11. End turn cleanup (mirrors engine's finishAttack / endPlayerTurn paths)
    if (!attacked) {
        match.performCheckup(false);
        if (match.winner) return;

        match.expireItems(false, 'end_of_your_turn');
        match.expireItems(true, 'end_of_opponent_turn');

        for (const inst of match.player.getAllInPlay()) {
            (match as any).clearPerTurnFlags?.(inst);
        }

        match.ai.hasRetreatedThisTurn = false;
        match.addLog('AI ends turn without attacking.');
        match.turn = 'player';
        match.hasAttachedEnergy = false;
        match.hasAttackedThisTurn = false;
    }

    // 12. If we're handing back to player, draw their card
    if (match.turn === 'player' && !match.winner) {
        match.turnNumber++;
        if (!match.player.draw(1)) {
            (match as any).declareWinner?.(false, 'Player ran out of cards');
        } else {
            match.addLog(`Player draws a card (turn ${match.turnNumber}).`);
        }
    }
}
