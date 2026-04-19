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

export class PokemonInstance {
    uid: number; 
    cards: InGameCard[];
    attachedEnergy: InGameCard[];
    currentDamage: number;

    constructor(basic: InGameCard) {
        this.uid = basic.uid;
        this.cards = [basic];
        this.attachedEnergy = [];
        this.currentDamage = 0;
    }

    get topCard(): InGameCard {
        return this.cards[this.cards.length - 1];
    }
}

export function isBasicPokemon(card: TCGCard): boolean {
    const isPokemon = card.supertype === 'Pokémon' || card.supertype === 'Pokemon';
    if (!isPokemon) return false;
    
    if (card.subtypes) {
        if (card.subtypes.includes('Stage 1') || card.subtypes.includes('Stage 2') || card.subtypes.includes('MEGA') || card.subtypes.includes('VMAX')) {
            return false;
        }
    }
    return true;
}

export function isEvolutionPokemon(card: TCGCard): boolean {
    const isPokemon = card.supertype === 'Pokémon' || card.supertype === 'Pokemon';
    if (!isPokemon) return false;
    return !!card.subtypes?.some(s => s === 'Stage 1' || s === 'Stage 2');
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

    const provided: Record<string, number> = {};
    let totalProvided = 0;
    
    for (const energy of instance.attachedEnergy) {
        let type = energy.name.replace(' Energy', ''); 
        if (energy.name === 'Double Colorless Energy') {
            totalProvided += 2;
        } else {
            provided[type] = (provided[type] || 0) + 1;
            totalProvided += 1;
        }
    }

    for (const [type, amount] of Object.entries(required)) {
        if ((provided[type] || 0) < amount) return false;
        totalProvided -= amount; 
    }

    return totalProvided >= colorlessRequired;
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
        const deck: InGameCard[] = [];
        
        // Filter the pool to grab specific cards for a functional "Mono-Fire Test Deck"
        const charmander = pool.find(c => c.name === 'Charmander');
        const charmeleon = pool.find(c => c.name === 'Charmeleon');
        const fireEnergy = pool.find(c => c.name === 'Fire Energy');
        const potion = pool.find(c => c.name === 'Potion');
        const bill = pool.find(c => c.name === 'Bill');
        
        // Fallback to random if something is missing from the JSON
        const fallback = pool[Math.floor(Math.random() * pool.length)];

        for (let i = 0; i < 60; i++) {
            let selectedCard = fallback;

            // Build a structured deck: 20 Basic, 10 Evolution, 20 Energy, 10 Trainers
            if (i < 20) selectedCard = charmander || fallback;
            else if (i < 30) selectedCard = charmeleon || fallback;
            else if (i < 50) selectedCard = fireEnergy || fallback;
            else if (i < 55) selectedCard = potion || fallback;
            else selectedCard = bill || fallback;

            deck.push({ 
                // We use structuredClone or spread to ensure we don't mutate the base JSON template
                ...selectedCard, 
                uid: this.cardUidCounter++ 
            });
        }
        
        // Shuffle the deck!
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

    evolvePokemon(isPlayer: boolean, uid: number, slot: 'active' | number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isEvolutionPokemon(card) || !card.evolvesFrom) return false;

        const targetInstance = slot === 'active' ? activePlayer.active : activePlayer.bench[slot];
        if (!targetInstance) return false;

        if (targetInstance.topCard.name !== card.evolvesFrom) return false;

        targetInstance.cards.push(card);
        activePlayer.hand.splice(handIndex, 1);
        this.addLog(`${isPlayer ? 'Player' : 'AI'} evolved ${card.evolvesFrom} into ${card.name}.`);

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

        const effect = TrainerEffects[card.name];
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
        const damage = isNaN(damageRaw) ? 0 : damageRaw;

        this.addLog(`${attacker.active.topCard.name} used ${attackUse.name}!`);

        if (damage > 0) {
            defender.active.currentDamage += damage;
            this.addLog(`It dealt ${damage} damage to ${defender.active.topCard.name}.`);

            const hpRaw = parseInt(defender.active.topCard.hp || '0');
            if (defender.active.currentDamage >= hpRaw) {
                this.processKnockout(!isPlayer); 
            }
        }

        if (isPlayer) this.player.selectedUid = null; 

        if (!this.winner) {
            this.turn = isPlayer ? 'ai' : 'player';
            this.hasAttachedEnergy = false; 
            if (this.turn === 'ai') this.executeAITurn();
        }
        return true;
    }

    executeAITurn() {
        if (this.winner) return;
        this.addLog("AI is taking its turn...");
        
        if (!this.ai.draw(1)) {
            this.winner = 'player';
            return;
        }

        // AI Logic: Play untargeted Trainers (Bill, Oak)
        for (let i = this.ai.hand.length - 1; i >= 0; i--) {
            const card = this.ai.hand[i];
            if (card.supertype === 'Trainer') {
                const effect = TrainerEffects[card.name];
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

        if (!attacked && !this.winner) {
            this.addLog("AI ends turn without attacking.");
            this.turn = 'player';
            this.hasAttachedEnergy = false; 
        }

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
