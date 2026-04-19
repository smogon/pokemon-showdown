import { TrainerEffects } from './effects';

export interface TCGCard {
    id: string;
    name: string;
    supertype: string;
    subtypes?: string[];
    hp?: string;
    types?: string[];
    evolvesFrom?: string; 
    images: { small: string, large: string };
    attacks?: { name: string, cost: string[], damage: string, text: string }[];
}

export interface InGameCard extends TCGCard {
    uid: number; 
}

// Items attached to a Pokémon that expire after a set trigger
export interface AttachedItem {
    card: InGameCard;
    // 'end_of_your_turn' = discard at end of the turn it was played (PlusPower)
    // 'end_of_opponent_turn' = discard at end of the opponent's next turn (Defender)
    expiresOn: 'end_of_your_turn' | 'end_of_opponent_turn';
}

export class PokemonInstance {
    uid: number; 
    cards: InGameCard[];
    attachedEnergy: InGameCard[];
    attachedItems: AttachedItem[];
    currentDamage: number;

    constructor(basic: InGameCard) {
        this.uid = basic.uid;
        this.cards = [basic];
        this.attachedEnergy = [];
        this.attachedItems = [];
        this.currentDamage = 0;
    }

    get topCard(): InGameCard {
        return this.cards[this.cards.length - 1];
    }

    // The stage of this instance: 0 = Basic, 1 = Stage 1, 2 = Stage 2
    get stage(): number {
        const top = this.topCard;
        if (top.subtypes?.includes('Stage 2')) return 2;
        if (top.subtypes?.includes('Stage 1')) return 1;
        return 0;
    }
}

// Basic Pokémon: supertype Pokémon, not an evolution stage, and not a special form
const EVOLUTION_SUBTYPES = new Set(['Stage 1', 'Stage 2', 'MEGA', 'VMAX', 'VSTAR', 'GX', 'EX']);

export function isBasicPokemon(card: TCGCard): boolean {
    if (card.supertype !== 'Pokémon' && card.supertype !== 'Pokemon') return false;
    if (!card.subtypes) return true; // No subtypes = Basic
    // Modern basics: "Basic" subtype, or V/EX that are explicitly Basic
    if (card.subtypes.includes('Basic')) return true;
    // If it has any evolution subtype it is not a basic
    if (card.subtypes.some(s => EVOLUTION_SUBTYPES.has(s))) return false;
    return true;
}

export function isEvolutionPokemon(card: TCGCard): boolean {
    if (card.supertype !== 'Pokémon' && card.supertype !== 'Pokemon') return false;
    return !!card.subtypes?.some(s => s === 'Stage 1' || s === 'Stage 2');
}

export function getEnergyType(card: TCGCard): string | null {
    if (!card.supertype?.includes('Energy')) return null;
    return card.name.replace(' Energy', '');
}

export function hasEnoughEnergy(instance: PokemonInstance, attackIndex: number): boolean {
    const attack = instance.topCard.attacks?.[attackIndex];
    if (!attack || !attack.cost || attack.cost.length === 0) return true;

    const required: Record<string, number> = {};
    let colorlessRequired = 0;
    
    for (const type of attack.cost) {
        if (type === 'Colorless') colorlessRequired++;
        else required[type] = (required[type] || 0) + 1;
    }

    // Build what energy we have, tracking colorless-equivalent surplus
    const provided: Record<string, number> = {};
    let freeSurplus = 0; // surplus that can fill Colorless slots
    
    for (const energy of instance.attachedEnergy) {
        if (energy.name === 'Double Colorless Energy') {
            freeSurplus += 2;
        } else if (energy.name === 'Rainbow Energy') {
            // Rainbow can be any type — we'll treat it as wild; add 1 to each type bucket
            // Handled below as a wildcard pass
            freeSurplus += 1; // simplified: counts as 1 colorless-flexible
        } else {
            const type = energy.name.replace(' Energy', '');
            provided[type] = (provided[type] || 0) + 1;
        }
    }

    // Check typed requirements first
    for (const [type, amount] of Object.entries(required)) {
        const have = provided[type] || 0;
        if (have >= amount) {
            // Surplus from this type can fill colorless
            freeSurplus += have - amount;
        } else {
            // Deficit — try to fill from rainbow/colorless surplus
            const deficit = amount - have;
            if (freeSurplus >= deficit) {
                freeSurplus -= deficit;
            } else {
                return false;
            }
        }
    }

    // Remaining typed surplus + free surplus must cover colorless
    const totalColorlessFillable = freeSurplus + Object.values(provided).reduce((a, b) => a + b, 0)
        - Object.values(required).reduce((a, b) => a + b, 0);

    return totalColorlessFillable >= colorlessRequired;
}

export class TCGPlayer {
    userid: string;
    deck: InGameCard[] = [];
    hand: InGameCard[] = [];
    active: PokemonInstance | null = null; 
    bench: (PokemonInstance | null)[] = [null, null, null, null, null]; 
    prizes: InGameCard[] = [];
    discard: InGameCard[] = [];
    
    selectedUid: number | null = null;
    // For multi-step trainer effects that need a secondary selection from hand/discard
    pendingEffect: {
        type: 'discard_for_effect' | 'pick_from_discard' | 'pick_from_deck';
        trainerUid: number;
        trainerName: string;
        // How many cards the player still needs to select
        needed: number;
        // Cards already selected for this pending effect
        selected: number[];
        // Optional filter function serialised as a string key
        filter?: string;
    } | null = null;

    constructor(userid: string) {
        this.userid = userid;
    }

    draw(amount = 1): boolean {
        for (let i = 0; i < amount; i++) {
            const card = this.deck.shift();
            if (card) {
                this.hand.push(card);
            } else {
                return false; 
            }
        }
        return true;
    }

    getAllInPlay(): PokemonInstance[] {
        const result: PokemonInstance[] = [];
        if (this.active) result.push(this.active);
        for (const b of this.bench) if (b) result.push(b);
        return result;
    }
}

export class TCGMatch {
    player: TCGPlayer;
    ai: TCGPlayer;
    turn: 'player' | 'ai' = 'player';
    winner: 'player' | 'ai' | null = null; 
    logs: string[] = [];
    
    hasAttachedEnergy = false; 
    private cardUidCounter = 0;

    constructor(userid: string, baseSetData: TCGCard[]) {
        this.player = new TCGPlayer(userid);
        this.ai = new TCGPlayer('AI');
        
        this.player.deck = this.generateDummyDeck(baseSetData);
        this.ai.deck = this.generateDummyDeck(baseSetData);

        this.player.draw(7);
        this.ai.draw(7);
        
        for (let i = 0; i < 6; i++) {
            this.player.prizes.push(this.player.deck.shift()!);
            this.ai.prizes.push(this.ai.deck.shift()!);
        }
        
        this.addLog(`Match started. Player drew 7 cards and set prizes.`);
    }

    private generateDummyDeck(pool: TCGCard[]): InGameCard[] {
        // Helper: find a card by name, throw clearly if missing so bad JSON is caught early
        const find = (name: string): TCGCard => {
            const card = pool.find(c => c.name === name);
            if (!card) throw new Error(`TCG test deck: card "${name}" not found in pool`);
            return card;
        };

        // Each entry is [card, copies].  Total must equal 60.
        const recipe: [TCGCard, number][] = [
            // --- Pokémon (20) ---
            // Abra → Kadabra → Alakazam: tests Stage 1, Stage 2, and Pokémon Breeder
            [find('Abra'),        4],
            [find('Kadabra'),     3],
            [find('Alakazam'),    2],
            // Standalone basics with real attacks for early-game attacking
            [find('Electabuzz'),  3],  // Lightning type, 2-energy attack
            [find('Hitmonchan'),  3],  // Fighting type, 1-energy attack
            // Magikarp + Gyarados: tests Stage 1 evolution on a fragile basic
            [find('Magikarp'),    2],
            [find('Gyarados'),    2],
            // Gastly + Haunter: Psychic type, bench presence for Switch/Scoop Up targets
            [find('Gastly'),      1],

            // --- Energy (14) ---
            [find('Psychic Energy'),         4],  // For Abra line + Haunter
            [find('Lightning Energy'),        4],  // For Electabuzz
            [find('Fighting Energy'),         3],  // For Hitmonchan
            [find('Double Colorless Energy'), 3],  // Tests DCE logic in hasEnoughEnergy

            // --- Trainers: no-target (8) ---
            [find('Bill'),                   2],
            [find('Professor Oak'),          2],
            [find('Impostor Professor Oak'), 1],
            [find('Lass'),                   1],
            [find('Full Heal'),              1],
            [find('Pokémon Center'),         1],

            // --- Trainers: own-field targeted (12) ---
            [find('Potion'),           2],
            [find('Super Potion'),     1],
            [find('Switch'),           2],
            [find('Scoop Up'),         1],
            [find('Defender'),         1],
            [find('PlusPower'),        2],
            [find('Devolution Spray'), 1],
            [find('Pokémon Breeder'),  1],
            [find('Revive'),           1],

            // --- Trainers: opponent-field targeted (4) ---
            [find('Gust of Wind'),         1],
            [find('Energy Removal'),       1],
            [find('Super Energy Removal'), 1],
            [find('Pokémon Flute'),        1],

            // --- Trainers: multi-step / pending (6) ---
            [find('Computer Search'), 1],
            [find('Item Finder'),     1],
            [find('Maintenance'),     1],
            [find('Pokémon Trader'),  1],
            [find('Energy Retrieval'),1],
            [find('Pokédex'),         1],
        ];

        // Verify the recipe adds up to exactly 60
        const total = recipe.reduce((sum, [, n]) => sum + n, 0);
        if (total !== 60) throw new Error(`TCG test deck has ${total} cards, expected 60`);

        const deck: InGameCard[] = [];
        for (const [card, copies] of recipe) {
            for (let i = 0; i < copies; i++) {
                deck.push({ ...card, uid: this.cardUidCounter++ });
            }
        }

        // Fisher-Yates shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        return deck;
    }

    addLog(msg: string) {
        this.logs.unshift(msg);
        if (this.logs.length > 20) this.logs.pop(); 
    }

    // Expire items that are due to be discarded
    private expireItems(forPlayer: boolean, timing: 'end_of_your_turn' | 'end_of_opponent_turn') {
        const owner = forPlayer ? this.player : this.ai;
        for (const inst of owner.getAllInPlay()) {
            const expired = inst.attachedItems.filter(i => i.expiresOn === timing);
            for (const item of expired) {
                owner.discard.push(item.card);
                this.addLog(`${item.card.name} on ${inst.topCard.name} expired and was discarded.`);
            }
            inst.attachedItems = inst.attachedItems.filter(i => i.expiresOn !== timing);
        }
    }

    playBasicPokemon(isPlayer: boolean, uid: number, slot: 'active' | number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false; 
        
        const card = activePlayer.hand[handIndex];
        if (!isBasicPokemon(card)) return false;

        if (slot === 'active') {
            if (activePlayer.active) return false; 
            activePlayer.active = new PokemonInstance(card);
            activePlayer.hand.splice(handIndex, 1);
            this.addLog(`${isPlayer ? 'Player' : 'AI'} set ${card.name} as Active Pokémon.`);
        } else {
            if (activePlayer.bench[slot]) return false; 
            activePlayer.bench[slot] = new PokemonInstance(card);
            activePlayer.hand.splice(handIndex, 1);
            this.addLog(`${isPlayer ? 'Player' : 'AI'} benched ${card.name}.`);
        }

        if (isPlayer) activePlayer.selectedUid = null; 
        return true;
    }

    evolvePokemon(isPlayer: boolean, uid: number, slot: 'active' | number, skipStageCheck = false) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isEvolutionPokemon(card) || !card.evolvesFrom) return false;

        const targetInstance = slot === 'active' ? activePlayer.active : activePlayer.bench[slot];
        if (!targetInstance) return false;

        if (skipStageCheck) {
            // Pokémon Breeder: allow Stage 2 directly on the matching Basic
            const basicName = card.evolvesFrom;
            // We need to trace the chain: Stage2.evolvesFrom = Stage1 name,
            // but Breeder needs the Basic. We check if the bottom card is the right Basic.
            // To find what Basic the Stage 2 ultimately evolves from, we walk the pool.
            // For now we accept if the target's bottomCard is a Basic that could lead to this card.
            // Simple approach: accept if topCard is Basic and card is Stage 2
            if (targetInstance.stage !== 0) return false;
        } else {
            if (targetInstance.topCard.name !== card.evolvesFrom) return false;
        }

        targetInstance.cards.push(card);
        activePlayer.hand.splice(handIndex, 1);
        this.addLog(`${isPlayer ? 'Player' : 'AI'} evolved ${card.evolvesFrom} into ${card.name}${skipStageCheck ? ' (via Pokémon Breeder)' : ''}.`);

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    attachEnergy(isPlayer: boolean, uid: number, slot: 'active' | number) {
        if (this.winner || this.hasAttachedEnergy) return false; 

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!card.supertype?.includes('Energy')) return false;

        const targetInstance = slot === 'active' ? activePlayer.active : activePlayer.bench[slot];
        if (!targetInstance) return false;

        targetInstance.attachedEnergy.push(card);
        activePlayer.hand.splice(handIndex, 1);
        this.hasAttachedEnergy = true;
        this.addLog(`${isPlayer ? 'Player' : 'AI'} attached ${card.name} to ${targetInstance.topCard.name}.`);
        
        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    playTrainer(isPlayer: boolean, uid: number, targetSlot?: 'active' | number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (card.supertype !== 'Trainer') return false;

        // Look up by ID first, fall back to name for future-proofing with reprints
        const effect = TrainerEffects[card.id] ?? TrainerEffects[card.name];
        if (!effect) {
            if (isPlayer) this.addLog(`Trainer card ${card.name} is not implemented yet!`);
            return false;
        }

        if (effect.requiresTarget && targetSlot === undefined) return false;

        const success = effect.execute(this, isPlayer, card, targetSlot);
        if (success) {
            activePlayer.hand.splice(handIndex, 1);
            activePlayer.discard.push(card);
            if (isPlayer) activePlayer.selectedUid = null;
            return true;
        }
        return false;
    }

    promote(isPlayer: boolean, benchIndex: number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        if (activePlayer.active !== null) return false; 
        
        const instance = activePlayer.bench[benchIndex];
        if (!instance) return false;

        activePlayer.active = instance;
        activePlayer.bench[benchIndex] = null;
        this.addLog(`${isPlayer ? 'Player' : 'AI'} promoted ${instance.topCard.name} to Active.`);
        return true;
    }

    private processKnockout(isPlayerKnockedOut: boolean) {
        const victim = isPlayerKnockedOut ? this.player : this.ai;
        const attacker = isPlayerKnockedOut ? this.ai : this.player;

        if (victim.active) {
            this.addLog(`${victim.active.topCard.name} was Knocked Out!`);
            victim.discard.push(...victim.active.cards, ...victim.active.attachedEnergy);
            // Also discard attached items
            for (const item of victim.active.attachedItems) victim.discard.push(item.card);
            victim.active = null;

            if (attacker.prizes.length > 0) {
                attacker.hand.push(attacker.prizes.shift()!);
                this.addLog(`${isPlayerKnockedOut ? 'AI' : 'Player'} took a Prize Card.`);

                if (attacker.prizes.length === 0) {
                    this.winner = isPlayerKnockedOut ? 'ai' : 'player';
                    this.addLog(`${isPlayerKnockedOut ? 'AI' : 'Player'} won the game!`);
                    return; 
                }
            }

            const hasBench = victim.bench.some(c => c !== null);
            if (!hasBench) {
                this.winner = isPlayerKnockedOut ? 'ai' : 'player';
                this.addLog(`${isPlayerKnockedOut ? 'Player' : 'AI'} has no Pokémon left!`);
            }
        }
    }

    attack(isPlayer: boolean, attackIndex: number) {
        if (this.winner) return false;

        const attacker = isPlayer ? this.player : this.ai;
        const defender = isPlayer ? this.ai : this.player;

        if (!attacker.active || !defender.active) return false;
        if (!hasEnoughEnergy(attacker.active, attackIndex)) return false;

        const attackUse = attacker.active.topCard.attacks?.[attackIndex];
        if (!attackUse) return false;

        const damageRaw = parseInt(attackUse.damage.replace(/[^0-9]/g, ''));
        let damage = isNaN(damageRaw) ? 0 : damageRaw;

        this.addLog(`${attacker.active.topCard.name} used ${attackUse.name}!`);

        if (damage > 0) {
            // PlusPower: +10 per PlusPower attached to the attacker
            const plusPowers = attacker.active.attachedItems.filter(i => i.card.name === 'PlusPower').length;
            if (plusPowers > 0) {
                damage += plusPowers * 10;
                this.addLog(`PlusPower boosted the attack by ${plusPowers * 10}!`);
            }

            // Defender: reduce incoming damage by 20 per Defender on the defending Pokémon
            const defenders = defender.active.attachedItems.filter(i => i.card.name === 'Defender').length;
            if (defenders > 0) {
                damage = Math.max(0, damage - defenders * 20);
                this.addLog(`Defender reduced the damage by ${defenders * 20}!`);
            }

            defender.active.currentDamage += damage;
            this.addLog(`It dealt ${damage} damage to ${defender.active.topCard.name}.`);

            const hpRaw = parseInt(defender.active.topCard.hp || '0');
            if (defender.active.currentDamage >= hpRaw) {
                this.processKnockout(!isPlayer); 
            }
        }

        // Expire PlusPower on the attacker at end of their turn
        this.expireItems(isPlayer, 'end_of_your_turn');
        // Expire Defender on the defender at end of the attacker's turn (= end of opponent's turn from defender's POV)
        this.expireItems(!isPlayer, 'end_of_opponent_turn');

        if (isPlayer) this.player.selectedUid = null; 

        if (!this.winner) {
            this.turn = isPlayer ? 'ai' : 'player';
            this.hasAttackedThisTurn = true;
            this.hasAttachedEnergy = false; 
            if (this.turn === 'ai') this.executeAITurn();
        }
        return true;
    }

    // Expose so endturn command can also expire items
    endPlayerTurn() {
        this.expireItems(true, 'end_of_your_turn');
        this.player.selectedUid = null;
        this.hasAttachedEnergy = false;
        this.hasAttackedThisTurn = false;
        this.turn = 'ai';
    }

    hasAttackedThisTurn = false;

    executeAITurn() {
        if (this.winner) return;
        this.addLog("AI is taking its turn...");
        
        if (!this.ai.draw(1)) {
            this.winner = 'player';
            return;
        }

        // AI Logic: Play untargeted Trainers (Bill, Oak, etc.)
        for (let i = this.ai.hand.length - 1; i >= 0; i--) {
            const card = this.ai.hand[i];
            if (card.supertype === 'Trainer') {
                const effect = TrainerEffects[card.id] ?? TrainerEffects[card.name];
                if (effect && !effect.requiresTarget) {
                    this.playTrainer(false, card.uid);
                }
            }
        }

        if (!this.ai.active) {
            const benchedIndex = this.ai.bench.findIndex(c => c !== null);
            if (benchedIndex !== -1) {
                this.promote(false, benchedIndex);
            } else {
                const basic = this.ai.hand.find(c => isBasicPokemon(c));
                if (basic) this.playBasicPokemon(false, basic.uid, 'active');
            }
        }

        for (const card of [...this.ai.hand]) {
            if (isBasicPokemon(card)) {
                const emptySlot = this.ai.bench.findIndex(c => c === null);
                if (emptySlot !== -1) this.playBasicPokemon(false, card.uid, emptySlot);
            } else if (isEvolutionPokemon(card)) {
                if (this.ai.active?.topCard.name === card.evolvesFrom) {
                    this.evolvePokemon(false, card.uid, 'active');
                } else {
                    const benchIndex = this.ai.bench.findIndex(inst => inst?.topCard.name === card.evolvesFrom);
                    if (benchIndex !== -1) this.evolvePokemon(false, card.uid, benchIndex);
                }
            }
        }

        if (!this.hasAttachedEnergy && this.ai.active) {
            const energyCard = this.ai.hand.find(c => c.supertype?.includes('Energy'));
            if (energyCard) {
                this.attachEnergy(false, energyCard.uid, 'active');
            }
        }

        let attacked = false;
        if (this.ai.active && this.ai.active.topCard.attacks && !this.winner) {
            for (let i = this.ai.active.topCard.attacks.length - 1; i >= 0; i--) {
                if (hasEnoughEnergy(this.ai.active, i)) {
                    attacked = this.attack(false, i);
                    break;
                }
            }
        }

        // Expire AI's end-of-turn items even if AI didn't attack
        if (!attacked) {
            this.expireItems(false, 'end_of_your_turn');
        }

        if (!attacked && !this.winner) {
            this.addLog("AI ends turn without attacking.");
            this.turn = 'player';
            this.hasAttachedEnergy = false; 
        }

        // Expire player's Defender at end of AI's turn
        this.expireItems(true, 'end_of_opponent_turn');

        if (this.turn === 'player' && !this.winner) {
            if (!this.player.draw(1)) {
                this.winner = 'ai';
                this.addLog("Player ran out of cards! AI wins!");
            } else {
                this.addLog("Player draws a card for turn.");
            }
        }
    }
}
