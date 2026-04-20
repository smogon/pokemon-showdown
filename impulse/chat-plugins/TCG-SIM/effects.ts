import type { TCGMatch, InGameCard } from './engine';
import { isBasicPokemon, isEvolutionPokemon, isEnergyCard, PokemonInstance } from './engine';

// ---------------------------------------------------------------------------
// Trainer Effect interface
// ---------------------------------------------------------------------------

export interface TrainerEffect {
    requiresTarget: boolean;
    opponentTarget?: boolean;
    execute: (match: TCGMatch, isPlayer: boolean, card: InGameCard, targetSlot?: 'active' | number) => boolean;
}

function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---------------------------------------------------------------------------
// Effect implementations — keyed by canonical name
// ---------------------------------------------------------------------------

const effects: Record<string, TrainerEffect> = {

    // -----------------------------------------------------------------------
    // Untargeted trainers
    // -----------------------------------------------------------------------

    "Bill": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            player.draw(2);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Bill — drew 2 cards.`);
            return true;
        }
    },

    "Professor Oak": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            const player = isPlayer ? match.player : match.ai;
            const rest = player.hand.filter(c => c.uid !== card.uid);
            player.hand = player.hand.filter(c => c.uid === card.uid);
            player.discard.push(...rest);
            player.draw(7);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Professor Oak — discarded hand and drew 7.`);
            return true;
        }
    },

    "Full Heal": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            const inst = player.active;
            if (!inst) return false;
            const { volatile, poisoned, burned } = inst.status;
            if (volatile === null && !poisoned && !burned) return false;
            inst.clearAllStatus();
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Full Heal — cured ${inst.topCard.name} of all status conditions.`);
            return true;
        }
    },

    "Pokémon Center": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            const healed: string[] = [];
            for (const inst of player.getAllInPlay()) {
                if (inst.currentDamage > 0) {
                    healed.push(inst.topCard.name);
                    inst.currentDamage = 0;
                    player.discard.push(...inst.attachedEnergy);
                    inst.attachedEnergy = [];
                }
            }
            if (healed.length === 0) return false;
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Pokémon Center — healed: ${healed.join(', ')}.`);
            return true;
        }
    },

    "Impostor Professor Oak": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const opponent = isPlayer ? match.ai : match.player;
            opponent.deck.push(...opponent.hand);
            opponent.hand = [];
            shuffle(opponent.deck);
            opponent.draw(7);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Impostor Professor Oak — opponent shuffled hand and drew 7.`);
            return true;
        }
    },

    "Lass": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            const player = isPlayer ? match.player : match.ai;
            const opponent = isPlayer ? match.ai : match.player;

            const removeTrainers = (p: typeof player) => {
                const trainers = p.hand.filter(c => c.supertype === 'Trainer');
                p.hand = p.hand.filter(c => c.supertype !== 'Trainer');
                p.deck.push(...trainers);
                shuffle(p.deck);
            };

            removeTrainers(player);
            removeTrainers(opponent);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Lass — all Trainer cards shuffled into both decks.`);
            if (isPlayer) player.selectedUid = null;
            return false;
        }
    },

    // -----------------------------------------------------------------------
    // Targeted trainers — own field
    // -----------------------------------------------------------------------

    "Potion": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.currentDamage === 0) return false;
            target.currentDamage = Math.max(0, target.currentDamage - 20);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Potion — healed 20 from ${target.topCard.name}.`);
            return true;
        }
    },

    "Super Potion": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.currentDamage === 0) return false;
            if (target.attachedEnergy.length === 0) return false;

            if (!isPlayer) {
                const discarded = target.attachedEnergy.pop()!;
                player.discard.push(discarded);
                target.currentDamage = Math.max(0, target.currentDamage - 40);
                match.addLog(`AI used Super Potion on ${target.topCard.name}.`);
                return true;
            }

            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: 'Super Potion',
                needed: 0,
                selected: [],
                filter: `superpotion_target:${targetSlot}`,
            };
            match.addLog(`Super Potion: Select 1 Energy to discard from ${target.topCard.name}.`);
            return false;
        }
    },

    "Switch": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const player = isPlayer ? match.player : match.ai;
            const benched = player.bench[targetSlot as number];
            if (!benched) return false;
            const currentActive = player.active;
            player.active = benched;
            player.bench[targetSlot as number] = currentActive;
            if (currentActive) currentActive.clearVolatileStatus();
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Switch.`);
            return true;
        }
    },

    "Scoop Up": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;

            if (!isBasicPokemon(target.cards[0])) return false;

            const basicCard = target.cards[0];
            player.discard.push(...target.cards.slice(1), ...target.attachedEnergy);
            for (const item of target.attachedItems) player.discard.push(item.card);

            player.hand.push(basicCard);

            if (targetSlot === 'active') {
                player.active = null;
                player.pendingPromotion = true;
            } else {
                player.bench[targetSlot as number] = null;
            }

            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Scoop Up on ${basicCard.name}.`);
            return true;
        }
    },

    "Defender": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;
            const handIdx = player.hand.findIndex(c => c.uid === card.uid);
            if (handIdx === -1) return false;
            player.hand.splice(handIdx, 1);
            target.attachedItems.push({ card, expiresOn: 'end_of_opponent_turn' });
            match.addLog(`${isPlayer ? 'Player' : 'AI'} attached Defender to ${target.topCard.name}.`);
            if (isPlayer) player.selectedUid = null;
            return false;
        }
    },

    "PlusPower": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;
            const handIdx = player.hand.findIndex(c => c.uid === card.uid);
            if (handIdx === -1) return false;
            player.hand.splice(handIdx, 1);
            target.attachedItems.push({ card, expiresOn: 'end_of_your_turn' });
            match.addLog(`${isPlayer ? 'Player' : 'AI'} attached PlusPower to ${target.topCard.name}.`);
            if (isPlayer) player.selectedUid = null;
            return false;
        }
    },

    "Pokémon Breeder": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                const stage2 = player.hand.find(c => c.subtypes?.includes('Stage 2'));
                if (!stage2) return false;
                for (const slot of ['active', 0, 1, 2, 3, 4] as ('active' | number)[]) {
                    if (match.evolvePokemon(false, stage2.uid, slot, true)) {
                        match.addLog(`AI played Pokémon Breeder — evolved ${stage2.name}.`);
                        return true;
                    }
                }
                return false;
            }
            const player = match.player;
            const hasStage2 = player.hand.some(c => c.uid !== card.uid && c.subtypes?.includes('Stage 2'));
            if (!hasStage2) {
                match.addLog('No Stage 2 in hand for Pokémon Breeder.');
                return false;
            }
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: 'Pokémon Breeder',
                needed: 1,
                selected: [],
                filter: 'stage2_hand',
            };
            match.addLog('Pokémon Breeder: Select the Stage 2, then click its Basic on the field.');
            return false;
        }
    },

    "Devolution Spray": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.cards.length < 2) return false;
            const removed = target.cards.pop()!;
            player.discard.push(removed);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Devolution Spray — removed ${removed.name}.`);
            return true;
        }
    },

    "Revive": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const player = isPlayer ? match.player : match.ai;
            const discardIndex = targetSlot as number;
            const revived = player.discard[discardIndex];
            if (!revived || !isBasicPokemon(revived)) return false;
            const emptySlot = player.firstEmptyBenchSlot();
            if (emptySlot === -1) return false;
            const newInstance = new PokemonInstance(revived as InGameCard, match.turnNumber);
            const halfHp = Math.floor((parseInt(revived.hp || '0') / 2) / 10) * 10;
            newInstance.currentDamage = halfHp;
            player.bench[emptySlot] = newInstance;
            player.discard.splice(discardIndex, 1);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Revive — ${revived.name} placed on Bench with ${halfHp} damage.`);
            return true;
        }
    },

    // -----------------------------------------------------------------------
    // Targeted trainers — opponent's field
    // -----------------------------------------------------------------------

    "Gust of Wind": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const opponent = isPlayer ? match.ai : match.player;
            const benched = opponent.bench[targetSlot as number];
            if (!benched) return false;
            const currentActive = opponent.active;
            opponent.active = benched;
            opponent.bench[targetSlot as number] = currentActive;
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Gust of Wind — ${benched.topCard.name} is now Active.`);
            return true;
        }
    },

    "Energy Removal": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const opponent = isPlayer ? match.ai : match.player;
            const target = targetSlot === 'active' ? opponent.active : opponent.bench[targetSlot as number];
            if (!target || target.attachedEnergy.length === 0) return false;
            const removed = target.attachedEnergy.pop()!;
            opponent.discard.push(removed);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Energy Removal — discarded ${removed.name} from ${target.topCard.name}.`);
            return true;
        }
    },

    "Super Energy Removal": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined) return false;
            const player = isPlayer ? match.player : match.ai;
            const opponent = isPlayer ? match.ai : match.player;
            const ownSources = player.getAllInPlay().filter(i => i.attachedEnergy.length > 0);
            if (ownSources.length === 0) return false;

            if (!isPlayer) {
                const selfDiscarded = ownSources[0].attachedEnergy.pop()!;
                player.discard.push(selfDiscarded);
                const target = targetSlot === 'active' ? opponent.active : opponent.bench[targetSlot as number];
                if (!target) return false;
                const removed: string[] = [];
                for (let i = 0; i < 2 && target.attachedEnergy.length > 0; i++) {
                    const r = target.attachedEnergy.pop()!;
                    opponent.discard.push(r);
                    removed.push(r.name);
                }
                match.addLog(`AI used Super Energy Removal — discarded ${removed.join(', ')}.`);
                return true;
            }

            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: 'Super Energy Removal',
                needed: 0,
                selected: [],
                filter: `ser_target:${targetSlot}`,
            };
            match.addLog(`Super Energy Removal: Select 1 Energy from your own Pokémon to discard.`);
            return false;
        }
    },

    "Pokémon Flute": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const opponent = isPlayer ? match.ai : match.player;
            const discardIndex = targetSlot as number;
            const target = opponent.discard[discardIndex];
            if (!target || !isBasicPokemon(target)) return false;
            const emptySlot = opponent.firstEmptyBenchSlot();
            if (emptySlot === -1) return false;
            opponent.bench[emptySlot] = new PokemonInstance(target as InGameCard, match.turnNumber);
            opponent.discard.splice(discardIndex, 1);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Pokémon Flute — ${target.name} moved to opponent's Bench.`);
            return true;
        }
    },

    // -----------------------------------------------------------------------
    // Clefairy Doll — acts as a Basic Pokémon (minimal: place on bench)
    // -----------------------------------------------------------------------

    "Clefairy Doll": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            const player = isPlayer ? match.player : match.ai;
            const emptySlot = player.firstEmptyBenchSlot();
            if (emptySlot === -1) return false;
            const instance = new PokemonInstance(card, match.turnNumber);
            player.bench[emptySlot] = instance;
            const handIdx = player.hand.findIndex(c => c.uid === card.uid);
            if (handIdx !== -1) player.hand.splice(handIdx, 1);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} placed Clefairy Doll on Bench.`);
            if (isPlayer) player.selectedUid = null;
            return false;
        }
    },

    // -----------------------------------------------------------------------
    // Multi-step trainers — pending effect system
    // -----------------------------------------------------------------------

    "Computer Search": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                if (player.hand.length < 2) return false;
                player.discard.push(player.hand.shift()!, player.hand.shift()!);
                const basicIdx = player.deck.findIndex(c => isBasicPokemon(c));
                if (basicIdx !== -1) {
                    player.hand.push(player.deck.splice(basicIdx, 1)[0]);
                    match.addLog(`AI used Computer Search.`);
                }
                return true;
            }
            const player = match.player;
            if (player.hand.filter(c => c.uid !== card.uid).length < 2) return false;
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 2,
                selected: [],
                filter: 'any_hand',
            };
            match.addLog(`Computer Search: Select 2 cards to discard, then pick any card from your deck.`);
            return false;
        }
    },

    "Item Finder": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                if (player.hand.length < 2) return false;
                player.discard.push(player.hand.shift()!, player.hand.shift()!);
                const tIdx = player.discard.findIndex(c => c.supertype === 'Trainer');
                if (tIdx !== -1) {
                    player.hand.push(player.discard.splice(tIdx, 1)[0]);
                    match.addLog(`AI used Item Finder.`);
                }
                return true;
            }
            const player = match.player;
            if (player.hand.filter(c => c.uid !== card.uid).length < 2) return false;
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 2,
                selected: [],
                filter: 'any_hand',
            };
            match.addLog(`Item Finder: Select 2 cards to discard, then pick a Trainer from your discard.`);
            return false;
        }
    },

    "Maintenance": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                if (player.hand.length < 2) return false;
                player.deck.push(player.hand.shift()!, player.hand.shift()!);
                shuffle(player.deck);
                player.draw(1);
                match.addLog(`AI used Maintenance.`);
                return true;
            }
            const player = match.player;
            if (player.hand.filter(c => c.uid !== card.uid).length < 2) return false;
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 2,
                selected: [],
                filter: 'any_hand',
            };
            match.addLog(`Maintenance: Select 2 cards to shuffle back, then draw 1.`);
            return false;
        }
    },

    "Pokémon Trader": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                const pokemonInHand = player.hand.find(c => isBasicPokemon(c) || isEvolutionPokemon(c));
                if (!pokemonInHand) return false;
                const idx = player.hand.indexOf(pokemonInHand);
                player.deck.push(player.hand.splice(idx, 1)[0]);
                shuffle(player.deck);
                const deckIdx = player.deck.findIndex(c => isBasicPokemon(c));
                if (deckIdx !== -1) {
                    player.hand.push(player.deck.splice(deckIdx, 1)[0]);
                    match.addLog(`AI used Pokémon Trader.`);
                }
                return true;
            }
            const player = match.player;
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 1,
                selected: [],
                filter: 'pokemon_hand',
            };
            match.addLog(`Pokémon Trader: Select a Pokémon to trade, then pick one from your deck.`);
            return false;
        }
    },

    "Energy Retrieval": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                if (player.hand.length < 1) return false;
                player.discard.push(player.hand.shift()!);
                const energies = player.discard.filter(c => c.subtypes?.includes('Basic') && isEnergyCard(c));
                for (let i = 0; i < 2 && energies.length > 0; i++) {
                    const e = energies.shift()!;
                    const idx = player.discard.indexOf(e);
                    player.hand.push(player.discard.splice(idx, 1)[0]);
                }
                match.addLog(`AI used Energy Retrieval.`);
                return true;
            }
            const player = match.player;
            if (player.hand.filter(c => c.uid !== card.uid).length < 1) return false;
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 1,
                selected: [],
                filter: 'any_hand',
            };
            match.addLog(`Energy Retrieval: Discard 1 card, then retrieve up to 2 basic Energies.`);
            return false;
        }
    },

    "Pokédex": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                match.addLog(`AI used Pokédex.`);
                return true;
            }
            const player = match.player;
            if (player.deck.length === 0) return false;
            player.pendingEffect = {
                type: 'pick_from_deck',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 0,
                selected: [],
                filter: 'pokedex',
            };
            match.addLog(`Pokédex: Rearrange the top 5 cards of your deck.`);
            return false;
        }
    },
};

// ---------------------------------------------------------------------------
// TrainerEffects registry — the engine always looks here
// ---------------------------------------------------------------------------

export const TrainerEffects: Record<string, TrainerEffect> = {};

for (const [name, effect] of Object.entries(effects)) {
    TrainerEffects[name] = effect;
}

// ---------------------------------------------------------------------------
// Set ID maps
// Each set registers its card IDs → canonical effect name.
// To add a new set: add its ID map below and call registerSetIds().
// ---------------------------------------------------------------------------

function registerSetIds(idMap: Record<string, string>) {
    for (const [id, name] of Object.entries(idMap)) {
        if (effects[name]) TrainerEffects[id] = effects[name];
    }
}

const BASE1_IDS: Record<string, string> = {
    'base1-70': 'Clefairy Doll',
    'base1-71': 'Computer Search',
    'base1-72': 'Devolution Spray',
    'base1-73': 'Impostor Professor Oak',
    'base1-74': 'Item Finder',
    'base1-75': 'Lass',
    'base1-76': 'Pokémon Breeder',
    'base1-77': 'Pokémon Trader',
    'base1-78': 'Scoop Up',
    'base1-79': 'Super Energy Removal',
    'base1-80': 'Defender',
    'base1-81': 'Energy Retrieval',
    'base1-82': 'Full Heal',
    'base1-83': 'Maintenance',
    'base1-84': 'PlusPower',
    'base1-85': 'Pokémon Center',
    'base1-86': 'Pokémon Flute',
    'base1-87': 'Pokédex',
    'base1-88': 'Professor Oak',
    'base1-89': 'Revive',
    'base1-90': 'Super Potion',
    'base1-91': 'Bill',
    'base1-92': 'Energy Removal',
    'base1-93': 'Gust of Wind',
    'base1-94': 'Potion',
    'base1-95': 'Switch',
};

const BASE2_IDS: Record<string, string> = {
    'base2-70': 'Clefairy Doll',
    'base2-71': 'Computer Search',
    'base2-72': 'Devolution Spray',
    'base2-73': 'Impostor Professor Oak',
    'base2-74': 'Item Finder',
    'base2-75': 'Lass',
    'base2-76': 'Pokémon Breeder',
    'base2-77': 'Pokémon Trader',
    'base2-78': 'Scoop Up',
    'base2-79': 'Super Energy Removal',
    'base2-80': 'Defender',
    'base2-81': 'Energy Retrieval',
    'base2-82': 'Full Heal',
    'base2-83': 'Maintenance',
    'base2-84': 'PlusPower',
    'base2-85': 'Pokémon Center',
    'base2-86': 'Pokémon Flute',
    'base2-87': 'Pokédex',
    'base2-88': 'Professor Oak',
    'base2-89': 'Revive',
    'base2-90': 'Super Potion',
    'base2-91': 'Bill',
    'base2-92': 'Energy Removal',
    'base2-93': 'Gust of Wind',
    'base2-94': 'Potion',
    'base2-95': 'Switch',
};

const JUNGLE_IDS: Record<string, string> = {
    'jungle-60': 'Pokémon Center',
    'jungle-61': 'Pokémon Flute',
};

const FOSSIL_IDS: Record<string, string> = {
    'fossil-58': 'Energy Retrieval',
    'fossil-59': 'Full Heal',
    'fossil-60': 'Revive',
    'fossil-61': 'Super Potion',
};

const LEGENDARY_IDS: Record<string, string> = {
    'legendary-70': 'Bill',
    'legendary-71': 'Computer Search',
    'legendary-72': 'Energy Removal',
    'legendary-73': 'Full Heal',
    'legendary-74': 'Gust of Wind',
    'legendary-75': 'Item Finder',
    'legendary-76': 'Maintenance',
    'legendary-77': 'Pokémon Breeder',
    'legendary-78': 'Pokémon Center',
    'legendary-79': 'Pokémon Trader',
    'legendary-80': 'Potion',
    'legendary-81': 'Professor Oak',
    'legendary-82': 'Scoop Up',
    'legendary-83': 'Super Energy Removal',
    'legendary-84': 'Super Potion',
    'legendary-85': 'Switch',
};

registerSetIds(BASE1_IDS);
registerSetIds(BASE2_IDS);
registerSetIds(JUNGLE_IDS);
registerSetIds(FOSSIL_IDS);
registerSetIds(LEGENDARY_IDS);
