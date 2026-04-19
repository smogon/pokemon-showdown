import type { TCGMatch, InGameCard } from './engine';

export interface TrainerEffect {
    requiresTarget: boolean;
    // targetSlot: slot on YOUR field unless markedAsOpponentTarget is true
    opponentTarget?: boolean;
    execute: (match: TCGMatch, isPlayer: boolean, card: InGameCard, targetSlot?: 'active' | number) => boolean;
}

// ---------------------------------------------------------------------------
// Helper: shuffle an array in place
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---------------------------------------------------------------------------
// The Dictionary of Card Effects
// Keyed by card ID first (future-proof for reprints), name is the fallback key.
// Both keys are registered at the bottom of the file.
// ---------------------------------------------------------------------------
const effects: Record<string, TrainerEffect> = {

    // -----------------------------------------------------------------------
    // NO-TARGET TRAINERS
    // -----------------------------------------------------------------------

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
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Professor Oak, discarded hand and drew 7 cards.`);
            return true;
        }
    },

    "Full Heal": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
            const player = isPlayer ? match.player : match.ai;
            if (!player.active) return false;
            // Status conditions aren't tracked yet; when they are, clear them here.
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Full Heal on ${player.active.topCard.name}.`);
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
            if (healed.length === 0) return false; // Nothing to heal
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Pokémon Center, healed all damage (and discarded all Energy) from: ${healed.join(', ')}.`);
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
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Impostor Professor Oak! Opponent shuffled hand and drew 7.`);
            return true;
        }
    },

    "Lass": {
        requiresTarget: false,
        execute: (match, isPlayer) => {
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
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Lass! All Trainer cards shuffled into both decks.`);
            return true;
        }
    },

    // -----------------------------------------------------------------------
    // TARGETED TRAINERS — YOUR FIELD
    // -----------------------------------------------------------------------

    "Potion": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.currentDamage === 0) return false;
            target.currentDamage = Math.max(0, target.currentDamage - 20);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Potion, healed 20 damage from ${target.topCard.name}.`);
            return true;
        }
    },

    "Super Potion": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.currentDamage === 0) return false;
            if (target.attachedEnergy.length === 0) return false; // Must discard 1 energy
            // Discard the last attached energy (AI picks automatically; player UI will pre-select)
            const discarded = target.attachedEnergy.pop()!;
            player.discard.push(discarded);
            target.currentDamage = Math.max(0, target.currentDamage - 40);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Super Potion on ${target.topCard.name}: discarded ${discarded.name}, healed 40 damage.`);
            return true;
        }
    },

    "Switch": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const benched = player.bench[targetSlot as number];
            if (!benched) return false;
            const currentActive = player.active;
            player.active = benched;
            player.bench[targetSlot as number] = currentActive;
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Switch, swapping ${currentActive?.topCard.name ?? 'nothing'} with ${benched.topCard.name}.`);
            return true;
        }
    },

    "Scoop Up": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;
            // Only the bottom (Basic) card returns to hand
            const basicCard = target.cards[0];
            // All other cards and attachments go to discard
            player.discard.push(...target.cards.slice(1), ...target.attachedEnergy);
            for (const item of target.attachedItems) player.discard.push(item.card);
            player.hand.push(basicCard);
            if (targetSlot === 'active') {
                player.active = null;
            } else {
                player.bench[targetSlot as number] = null;
            }
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Scoop Up on ${basicCard.name}, returning it to hand.`);
            return true;
        }
    },

    "Defender": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;
            target.attachedItems.push({ card, expiresOn: 'end_of_opponent_turn' });
            match.addLog(`${isPlayer ? 'Player' : 'AI'} attached Defender to ${target.topCard.name}.`);
            // Card is NOT discarded to discard pile yet — it lives on the Pokémon
            // The engine's playTrainer will push it to discard, so we return true but the
            // caller must NOT double-discard. We handle this by not pushing to discard in
            // playTrainer when the effect itself manages the card lifecycle.
            // Since our engine does push to discard after execute(), the card copy already
            // on the Pokémon is the same object — that is fine for gameplay purposes.
            return true;
        }
    },

    "PlusPower": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target) return false;
            target.attachedItems.push({ card, expiresOn: 'end_of_your_turn' });
            match.addLog(`${isPlayer ? 'Player' : 'AI'} attached PlusPower to ${target.topCard.name}.`);
            return true;
        }
    },

    "Pokémon Breeder": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            // The selected card in hand should be a Stage 2. We find it via the pending state.
            // The UI will set match.player.selectedUid to the Stage 2 card before calling playtrainer.
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const stage2Uid = player.selectedUid;
            if (stage2Uid === null) return false;
            // Delegate to evolvePokemon with skipStageCheck = true
            return match.evolvePokemon(isPlayer, stage2Uid, targetSlot, true);
        }
    },

    "Devolution Spray": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? player.active : player.bench[targetSlot as number];
            if (!target || target.cards.length < 2) return false; // Nothing to devolve
            const removed = target.cards.pop()!;
            player.discard.push(removed);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Devolution Spray, removing ${removed.name} from ${target.topCard.name}.`);
            return true;
        }
    },

    "Revive": {
        requiresTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            // targetSlot here is the discard index of the Basic to revive.
            // The UI sends it as a number representing index in the discard pile.
            const player = isPlayer ? match.player : match.ai;
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const discardIndex = targetSlot as number;
            const revived = player.discard[discardIndex];
            if (!revived) return false;
            // Must be a Basic Pokémon
            const { isBasicPokemon } = require('./engine');
            if (!isBasicPokemon(revived)) return false;
            // Find an empty bench slot
            const emptySlot = player.bench.findIndex(s => s === null);
            if (emptySlot === -1) return false; // Bench full
            const { PokemonInstance } = require('./engine');
            const newInstance = new PokemonInstance(revived);
            const halfHp = Math.round((parseInt(revived.hp || '0') / 2) / 10) * 10;
            newInstance.currentDamage = halfHp;
            player.bench[emptySlot] = newInstance;
            player.discard.splice(discardIndex, 1);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Revive! ${revived.name} is now on the Bench with ${halfHp} damage.`);
            return true;
        }
    },

    // -----------------------------------------------------------------------
    // TARGETED TRAINERS — OPPONENT'S FIELD
    // -----------------------------------------------------------------------

    "Gust of Wind": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const opponent = isPlayer ? match.ai : match.player;
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const benched = opponent.bench[targetSlot as number];
            if (!benched) return false;
            const currentActive = opponent.active;
            opponent.active = benched;
            opponent.bench[targetSlot as number] = currentActive;
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Gust of Wind! ${benched.topCard.name} was forced to the Active spot.`);
            return true;
        }
    },

    "Energy Removal": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const opponent = isPlayer ? match.ai : match.player;
            if (targetSlot === undefined) return false;
            const target = targetSlot === 'active' ? opponent.active : opponent.bench[targetSlot as number];
            if (!target || target.attachedEnergy.length === 0) return false;
            // Remove the last attached energy (UI will allow picking in the future)
            const removed = target.attachedEnergy.pop()!;
            opponent.discard.push(removed);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Energy Removal! Discarded ${removed.name} from ${target.topCard.name}.`);
            return true;
        }
    },

    "Super Energy Removal": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            const player = isPlayer ? match.player : match.ai;
            const opponent = isPlayer ? match.ai : match.player;
            if (targetSlot === undefined) return false;
            // Player must have at least 1 energy attached to any of their Pokémon
            const ownEnergySources = player.getAllInPlay().filter(i => i.attachedEnergy.length > 0);
            if (ownEnergySources.length === 0) return false;
            // Auto-discard from first available own Pokémon (AI) or active (player fallback)
            const ownSource = ownEnergySources[0];
            const selfDiscarded = ownSource.attachedEnergy.pop()!;
            player.discard.push(selfDiscarded);
            // Discard up to 2 from opponent's target
            const target = targetSlot === 'active' ? opponent.active : opponent.bench[targetSlot as number];
            if (!target) return false;
            const removed: string[] = [];
            for (let i = 0; i < 2 && target.attachedEnergy.length > 0; i++) {
                const r = target.attachedEnergy.pop()!;
                opponent.discard.push(r);
                removed.push(r.name);
            }
            match.addLog(`${isPlayer ? 'Player' : 'AI'} used Super Energy Removal! Discarded ${selfDiscarded.name} from own side; removed ${removed.join(', ')} from ${target.topCard.name}.`);
            return true;
        }
    },

    "Pokémon Flute": {
        requiresTarget: true,
        opponentTarget: true,
        execute: (match, isPlayer, card, targetSlot) => {
            // targetSlot is the index in the OPPONENT'S discard pile
            const opponent = isPlayer ? match.ai : match.player;
            if (targetSlot === undefined || targetSlot === 'active') return false;
            const discardIndex = targetSlot as number;
            const target = opponent.discard[discardIndex];
            if (!target) return false;
            const { isBasicPokemon, PokemonInstance } = require('./engine');
            if (!isBasicPokemon(target)) return false;
            const emptySlot = opponent.bench.findIndex(s => s === null);
            if (emptySlot === -1) return false; // Opponent's bench full
            opponent.bench[emptySlot] = new PokemonInstance(target);
            opponent.discard.splice(discardIndex, 1);
            match.addLog(`${isPlayer ? 'Player' : 'AI'} played Pokémon Flute! Moved ${target.name} from opponent's discard to their Bench.`);
            return true;
        }
    },

    // -----------------------------------------------------------------------
    // COMPLEX TRAINERS — MULTI-STEP (pending effect system)
    // These return false immediately if the pending state isn't set up yet,
    // and use match.player.pendingEffect to collect the required choices.
    // -----------------------------------------------------------------------

    "Computer Search": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                // AI: discard 2 random cards and search for a basic
                const player = match.ai;
                if (player.hand.length < 2) return false;
                player.discard.push(player.hand.shift()!, player.hand.shift()!);
                const basicIdx = player.deck.findIndex(c => {
                    const { isBasicPokemon } = require('./engine');
                    return isBasicPokemon(c);
                });
                if (basicIdx !== -1) {
                    player.hand.push(player.deck.splice(basicIdx, 1)[0]);
                    match.addLog(`AI used Computer Search to find a Pokémon.`);
                }
                return true;
            }
            // Player: open a deck-search pending flow (UI handles the rest)
            const player = match.player;
            if (player.hand.filter(c => c.uid !== card.uid).length < 2) return false;
            // Store pending state — UI will call /tcg pendingselect to complete
            player.pendingEffect = {
                type: 'discard_for_effect',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 2,
                selected: [],
                filter: 'any_hand'
            };
            match.addLog(`Computer Search: Select 2 cards from your hand to discard, then pick a card from your deck.`);
            return false; // Don't consume the card yet — multi-step
        }
    },

    "Item Finder": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                if (player.hand.length < 2) return false;
                player.discard.push(player.hand.shift()!, player.hand.shift()!);
                const trainerIdx = player.discard.findIndex(c => c.supertype === 'Trainer');
                if (trainerIdx !== -1) {
                    player.hand.push(player.discard.splice(trainerIdx, 1)[0]);
                    match.addLog(`AI used Item Finder to retrieve a Trainer card.`);
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
                filter: 'any_hand'
            };
            match.addLog(`Item Finder: Select 2 cards from your hand to discard, then pick a Trainer from your discard pile.`);
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
                filter: 'any_hand'
            };
            match.addLog(`Maintenance: Select 2 cards from your hand to shuffle back into your deck, then draw 1.`);
            return false;
        }
    },

    "Pokémon Trader": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                const player = match.ai;
                const basicInHand = player.hand.find(c => {
                    const { isBasicPokemon, isEvolutionPokemon } = require('./engine');
                    return isBasicPokemon(c) || isEvolutionPokemon(c);
                });
                if (!basicInHand) return false;
                const idx = player.hand.indexOf(basicInHand);
                player.deck.push(player.hand.splice(idx, 1)[0]);
                shuffle(player.deck);
                const deckBasic = player.deck.findIndex(c => {
                    const { isBasicPokemon } = require('./engine');
                    return isBasicPokemon(c);
                });
                if (deckBasic !== -1) {
                    player.hand.push(player.deck.splice(deckBasic, 1)[0]);
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
                filter: 'pokemon_hand'
            };
            match.addLog(`Pokémon Trader: Select a Pokémon from your hand to trade, then pick one from your deck.`);
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
                const energies = player.discard.filter(c => c.subtypes?.includes('Basic') && c.supertype === 'Energy');
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
                filter: 'any_hand'
            };
            match.addLog(`Energy Retrieval: Select 1 card from your hand to discard, then retrieve up to 2 basic Energies from your discard.`);
            return false;
        }
    },

    "Pokédex": {
        requiresTarget: false,
        execute: (match, isPlayer, card) => {
            if (!isPlayer) {
                // AI does nothing (can't meaningfully rearrange)
                match.addLog(`AI looked at the top of their deck with Pokédex.`);
                return true;
            }
            const player = match.player;
            if (player.deck.length === 0) return false;
            player.pendingEffect = {
                type: 'pick_from_deck',
                trainerUid: card.uid,
                trainerName: card.name,
                needed: 0, // 0 = rearrange mode, not pick mode
                selected: [],
                filter: 'pokedex'
            };
            match.addLog(`Pokédex: Rearrange the top 5 cards of your deck.`);
            return false;
        }
    },

};

// ---------------------------------------------------------------------------
// Register effects by card ID (from base1.json) AND by name as fallback.
// When a new set is added, just add its card IDs here — the name entry stays
// as a safety net for any set whose IDs aren't registered yet.
// ---------------------------------------------------------------------------
export const TrainerEffects: Record<string, TrainerEffect> = {};

// Name-based registrations (fallback for any set)
for (const [name, effect] of Object.entries(effects)) {
    TrainerEffects[name] = effect;
}

// ID-based registrations for Base Set 1 (takes precedence over name)
const base1IdMap: Record<string, string> = {
    'base1-70': 'Clefairy Doll',   // not implemented above — will fall through to name lookup
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

for (const [id, name] of Object.entries(base1IdMap)) {
    if (effects[name]) {
        TrainerEffects[id] = effects[name];
    }
}
