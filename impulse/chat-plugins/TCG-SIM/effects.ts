import type { TCGMatch, InGameCard } from './engine';

export interface TrainerEffect {
    requiresTarget: boolean;
    execute: (match: TCGMatch, isPlayer: boolean, card: InGameCard, targetSlot?: 'active' | number) => boolean;
}

// The Dictionary of Card Effects
export const TrainerEffects: Record<string, TrainerEffect> = {
    "Bill": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            player.draw(2);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Bill and drew 2 cards.`);
            return true;
        }
    },
    "Professor Oak": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            player.discard.push(...player.hand);
            player.hand = [];
            player.draw(7);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Professor Oak, discarded their hand, and drew 7 cards.`);
            return true;
        }
    },
    "Potion": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot];
            if (!target) return false;
            if (target.currentDamage === 0) return false; // Cannot heal undamaged Pokémon

            target.currentDamage = Math.max(0, target.currentDamage - 20);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Potion and healed 20 damage from ${target.topCard.name}.`);
            return true;
        }
    },
    "Switch": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined || targetSlot === 'active') return false; // Must target bench
            
            const benched = player.bench[targetSlot];
            if (!benched) return false;

            const currentActive = player.active;
            player.active = benched;
            player.bench[targetSlot] = currentActive;

            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Switch, swapping ${currentActive?.topCard.name || 'nothing'} with ${benched.topCard.name}.`);
            return true;
        }
    }
};
