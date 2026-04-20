import type { TCGMatch, PokemonInstance, InGameCard } from './engine';
import { isEnergyCard, isBasicPokemon, flipCoin } from './engine';
import type { CardPower } from './engine';

// ---------------------------------------------------------------------------
// Power Requirements Parser
// Reads the raw text of a Pokémon Power to determine if it requires
// target selection before it can be executed.
// ---------------------------------------------------------------------------

export function getPowerRequirements(power: CardPower): { filter?: string, needed: number } | null {
    const text = power.text.toLowerCase();
    
    // Parse target requirements from official card text
    if (text.includes('move 1 damage counter from 1 of your pokémon to another')) {
        return { filter: 'damage_swap_from', needed: 1 };
    }
    if (text.includes('attach 1 water energy card to 1 of your water pokémon')) {
        return { filter: 'rain_dance_energy', needed: 1 };
    }
    if (text.includes('take 1 grass energy card attached to 1 of your pokémon and attach it to a different one')) {
        return { filter: 'energy_trans_from', needed: 1 };
    }
    if (text.includes('choose 1 of them and switch it with his or her active')) {
        return { filter: 'lure_energy', needed: 1 };
    }
    
    // Instant / Self-targeted powers
    if (text.includes('turn all energy attached') || text.includes('knock out')) {
        return { needed: 0 };
    }
    
    return null;
}

// ---------------------------------------------------------------------------
// Pokémon Power / Ability Resolver
// ---------------------------------------------------------------------------

export interface PowerEffectHandler {
    (
        match: TCGMatch,
        isPlayer: boolean,
        ownerInst: PokemonInstance,
        power: CardPower,
        targetData?: unknown
    ): boolean;
}

// ---------------------------------------------------------------------------
// Base Set 1 + Fossil power handlers
// ---------------------------------------------------------------------------

const POWER_HANDLERS: Record<string, PowerEffectHandler> = {

    // ---- Alakazam: Damage Swap ----------------------------------------------
    'Damage Swap': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        const data = targetData as { fromUid?: number; toUid?: number } | undefined;
        if (!data?.fromUid || !data?.toUid) return false;
        
        const from = player.findInPlay(data.fromUid);
        const to = player.findInPlay(data.toUid);
        if (!from || !to) return false;
        
        if (from.currentDamage < 10) {
            match.addLog(`Damage Swap: ${from.topCard.name} has no damage to move.`);
            return false;
        }
        if (to.currentDamage + 10 >= to.maxHP) {
            match.addLog(`Damage Swap: Cannot KO your own Pokémon.`);
            return false;
        }
        
        from.currentDamage -= 10;
        to.currentDamage += 10;
        match.addLog(`Damage Swap: Moved 10 damage from ${from.topCard.name} to ${to.topCard.name}.`);
        return true;
    },

    // ---- Blastoise: Rain Dance ----------------------------------------------
    'Rain Dance': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        const data = targetData as { energyUid?: number; targetSlot?: 'active' | number } | undefined;
        if (data?.energyUid === undefined || data?.targetSlot === undefined) return false;
        
        const energyIdx = player.hand.findIndex(c => c.uid === data.energyUid);
        if (energyIdx === -1 || player.hand[energyIdx].name !== 'Water Energy') return false;
        
        const targetInst = data.targetSlot === 'active' ? player.active : player.bench[data.targetSlot as number];
        if (!targetInst || !targetInst.topCard.types?.includes('Water')) return false;
        
        targetInst.attachedEnergy.push(player.hand.splice(energyIdx, 1)[0]);
        match.addLog(`Rain Dance: Attached Water Energy to ${targetInst.topCard.name}.`);
        return true;
    },

    // ---- Charizard: Energy Burn ---------------------------------------------
    'Energy Burn': (match, isPlayer, owner, power, targetData) => {
        for (const e of owner.attachedEnergy) {
            (e as any)._originalName = e.name;
            e.name = 'Fire Energy';
        }
        match.addLog(`Energy Burn: All Energy on ${owner.topCard.name} treated as Fire this turn.`);
        return true;
    },

    // ---- Venusaur: Energy Trans ---------------------------------------------
    'Energy Trans': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        const data = targetData as { energyUid?: number; fromUid?: number; toUid?: number } | undefined;
        if (data?.energyUid === undefined || data?.fromUid === undefined || data?.toUid === undefined) return false;
        
        const from = player.findInPlay(data.fromUid);
        const to = player.findInPlay(data.toUid);
        if (!from || !to) return false;
        
        const eIdx = from.attachedEnergy.findIndex(e => e.uid === data.energyUid);
        if (eIdx === -1 || from.attachedEnergy[eIdx].name !== 'Grass Energy') return false;
        
        to.attachedEnergy.push(from.attachedEnergy.splice(eIdx, 1)[0]);
        match.addLog(`Energy Trans: Moved Grass Energy to ${to.topCard.name}.`);
        return true;
    },

    // ---- Ninetales: Lure ----------------------------------------------------
    'Lure': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        const opponent = isPlayer ? match.ai : match.player;
        const data = targetData as { energyUid?: number; benchIndex?: number } | undefined;
        if (data?.energyUid === undefined || data?.benchIndex === undefined) return false;
        
        const eIdx = player.hand.findIndex(c => c.uid === data.energyUid);
        if (eIdx === -1 || player.hand[eIdx].name !== 'Fire Energy') return false;
        
        const benched = opponent.bench[data.benchIndex as number];
        if (!benched) return false;
        
        player.discard.push(player.hand.splice(eIdx, 1)[0]);
        const currentActive = opponent.active;
        opponent.active = benched;
        opponent.bench[data.benchIndex as number] = currentActive;
        match.addLog(`Lure: ${benched.topCard.name} was pulled to the Active spot.`);
        return true;
    },

    // ---- Electrode: Buzzap --------------------------------------------------
    'Buzzap': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        player.discard.push(...owner.cards, ...owner.attachedEnergy);
        
        // Remove from field
        if (player.active?.uid === owner.uid) {
            player.active = null;
            player.pendingPromotion = true;
        } else {
            const bIdx = player.bench.findIndex(b => b?.uid === owner.uid);
            if (bIdx !== -1) player.bench[bIdx] = null;
        }
        
        match.addLog(`Buzzap: ${owner.topCard.name} was Knocked Out! Attach it as 2 Lightning Energy. (Partial implementation)`);
        return true;
    },

    // ---- Passive Power Stubs ------------------------------------------------
    'Strikes Back': () => false,
    'Invisible Wall': () => false,
    'Metronome': () => false,

    // ---- Fossil / Neo additions: placeholder pattern ------------------------
    'Devolution Beam': (match, isPlayer, owner, power, targetData) => {
        const player = isPlayer ? match.player : match.ai;
        const data = targetData as { targetUid?: number } | undefined;
        if (!data?.targetUid) return false;
        const target = player.findInPlay(data.targetUid);
        if (!target || target.cards.length < 2) return false;
        const removed = target.cards.pop()!;
        player.discard.push(removed);
        match.addLog(`Devolution Beam: Removed ${removed.name}.`);
        return true;
    },
};

// ---------------------------------------------------------------------------
// Passive power checks — called by engine at specific game moments
// ---------------------------------------------------------------------------

export function checkPassivePowers(
    match: TCGMatch,
    triggerType: 'before_damage' | 'after_damage' | 'on_bench',
    targetInst: PokemonInstance,
    targetIsPlayer: boolean,
    damageAmount?: number,
    attackerInst?: PokemonInstance
): void {
    const player = targetIsPlayer ? match.player : match.ai;

    for (const inst of player.getAllInPlay()) {
        if (inst.isPowerBlocked()) continue;
        for (const power of inst.topCard.abilities ?? []) {
            if (power.type !== 'Pokémon Power' && power.type !== 'Poké-Body') continue;

            if (power.name === 'Invisible Wall' && triggerType === 'before_damage' && inst.uid === targetInst.uid) {
                if ((damageAmount ?? 0) >= 30) {
                    targetInst.protectedThisTurn = true;
                    match.addLog(`Invisible Wall: ${inst.topCard.name} blocked the attack!`);
                }
            }

            if (power.name === 'Strikes Back' && triggerType === 'after_damage' && inst.uid === targetInst.uid && attackerInst) {
                attackerInst.currentDamage += 10;
                match.addLog(`Strikes Back: Placed 1 damage counter on ${attackerInst.topCard.name}.`);
                if (attackerInst.isKnockedOut()) match.processKnockout(!targetIsPlayer);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Public resolver
// ---------------------------------------------------------------------------

export function resolvePokemonPower(
    match: TCGMatch,
    isPlayer: boolean,
    ownerInst: PokemonInstance,
    power: CardPower,
    targetData?: unknown
): boolean {
    const byCardIdPower = ownerInst.topCard.id
        ? POWER_HANDLERS[`${ownerInst.topCard.id}:${power.name}`]
        : null;
    const handler = byCardIdPower ?? POWER_HANDLERS[power.name];

    if (!handler) {
        match.addLog(`${power.name} has no implemented effect yet.`);
        return false;
    }

    return handler(match, isPlayer, ownerInst, power, targetData);
}
