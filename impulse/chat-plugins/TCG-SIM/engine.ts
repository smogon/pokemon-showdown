import { TrainerEffects } from './effects';
import { resolvePokemonPower } from './power-effects';
import { resolveAttackEffect } from './attack-effects';

// ---------------------------------------------------------------------------
// Card data interfaces — mirrors the TCG API JSON shape exactly.
// Future sets extend naturally; no changes needed here when new cards arrive.
// ---------------------------------------------------------------------------

export interface WeaknessResistance {
    type: string;
    value: string;
}

export interface CardAttack {
    name: string;
    cost: string[];
    damage: string;
    text: string;
    convertedEnergyCost?: number;
}

export interface CardPower {
    name: string;
    text: string;
    type: 'Pokémon Power' | 'Poké-Power' | 'Poké-Body' | 'Ability';
}

export interface TCGCard {
    id: string;
    name: string;
    supertype: string;
    subtypes?: string[];
    hp?: string;
    types?: string[];
    evolvesFrom?: string;
    weaknesses?: WeaknessResistance[];
    resistances?: WeaknessResistance[];
    retreatCost?: string[];
    abilities?: CardPower[];
    attacks?: CardAttack[];
    rules?: string[];
    images: { small: string; large: string };
    set?: { id: string; name: string };
    number?: string;
    rarity?: string;
    artist?: string;
}

export interface InGameCard extends TCGCard {
    uid: number;
}

// ---------------------------------------------------------------------------
// Attached items — Tools / temporary Trainer cards on a Pokémon
// ---------------------------------------------------------------------------

export interface AttachedItem {
    card: InGameCard;
    expiresOn: 'end_of_your_turn' | 'end_of_opponent_turn' | 'permanent';
}

// ---------------------------------------------------------------------------
// Status conditions
// Poisoned / Burned can coexist with Asleep/Paralyzed/Confused (official rule).
// We store them separately so both can be active at once.
// ---------------------------------------------------------------------------

export type VolatileStatus = 'asleep' | 'confused' | 'paralyzed' | null;

export interface StatusState {
    volatile: VolatileStatus;
    poisoned: boolean;
    burned: boolean;
}

function freshStatus(): StatusState {
    return { volatile: null, poisoned: false, burned: false };
}

// ---------------------------------------------------------------------------
// PokemonInstance
// ---------------------------------------------------------------------------

export class PokemonInstance {
    uid: number;
    cards: InGameCard[];
    attachedEnergy: InGameCard[];
    attachedItems: AttachedItem[];
    currentDamage: number;
    turnPlaced: number;
    status: StatusState;
    protectedThisTurn: boolean;
    damageModThisTurn: number;

    constructor(basic: InGameCard, turnPlaced = 0) {
        this.uid = basic.uid;
        this.cards = [basic];
        this.attachedEnergy = [];
        this.attachedItems = [];
        this.currentDamage = 0;
        this.turnPlaced = turnPlaced;
        this.status = freshStatus();
        this.protectedThisTurn = false;
        this.damageModThisTurn = 0;
    }

    get topCard(): InGameCard {
        return this.cards[this.cards.length - 1];
    }

    get stage(): number {
        const top = this.topCard;
        if (top.subtypes?.includes('Stage 2')) return 2;
        if (top.subtypes?.includes('Stage 1')) return 1;
        return 0;
    }

    get retreatCostCount(): number {
        return this.topCard.retreatCost?.length ?? 0;
    }

    get maxHP(): number {
        return parseInt(this.topCard.hp || '0');
    }

    get currentHP(): number {
        return Math.max(0, this.maxHP - this.currentDamage);
    }

    isKnockedOut(): boolean {
        return this.maxHP > 0 && this.currentDamage >= this.maxHP;
    }

    clearVolatileStatus() {
        this.status.volatile = null;
    }

    clearAllStatus() {
        this.status = freshStatus();
    }

    hasPower(powerName: string): boolean {
        return !!this.topCard.abilities?.some(a => a.name === powerName);
    }

    isPowerBlocked(): boolean {
        return this.status.volatile === 'asleep'
            || this.status.volatile === 'confused'
            || this.status.volatile === 'paralyzed';
    }
}

// ---------------------------------------------------------------------------
// Helper functions exported for use across files
// ---------------------------------------------------------------------------

const EVOLUTION_SUBTYPES = new Set(['Stage 1', 'Stage 2', 'MEGA', 'VMAX', 'VSTAR', 'GX', 'EX']);

export function isBasicPokemon(card: TCGCard): boolean {
    if (card.supertype !== 'Pokémon' && card.supertype !== 'Pokemon') return false;
    if (!card.subtypes) return true;
    if (card.subtypes.includes('Basic')) return true;
    if (card.subtypes.some(s => EVOLUTION_SUBTYPES.has(s))) return false;
    return true;
}

export function isEvolutionPokemon(card: TCGCard): boolean {
    if (card.supertype !== 'Pokémon' && card.supertype !== 'Pokemon') return false;
    return !!card.subtypes?.some(s => s === 'Stage 1' || s === 'Stage 2');
}

export function isPokemonCard(card: TCGCard): boolean {
    return card.supertype === 'Pokémon' || card.supertype === 'Pokemon';
}

export function isEnergyCard(card: TCGCard): boolean {
    return card.supertype === 'Energy';
}

export function isTrainerCard(card: TCGCard): boolean {
    return card.supertype === 'Trainer';
}

export function getEnergyType(card: TCGCard): string | null {
    if (!isEnergyCard(card)) return null;
    return card.name.replace(' Energy', '');
}

export function flipCoin(): boolean {
    return Math.random() < 0.5;
}

export function flipCoins(n: number): boolean[] {
    return Array.from({ length: n }, () => flipCoin());
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

    const typed: Record<string, number> = {};
    let colorlessFlex = 0;
    let wildFlex = 0;

    for (const energy of instance.attachedEnergy) {
        const name = energy.name;
        if (name === 'Double Colorless Energy') {
            colorlessFlex += 2;
        } else if (name === 'Rainbow Energy' || name === 'Prism Energy') {
            wildFlex += 1;
        } else if (name === 'Metal Energy' || name === 'Darkness Energy') {
            const type = name.replace(' Energy', '');
            typed[type] = (typed[type] || 0) + 1;
        } else if (isEnergyCard(energy)) {
            const type = name.replace(' Energy', '');
            typed[type] = (typed[type] || 0) + 1;
        }
    }

    for (const [type, needed] of Object.entries(required)) {
        const have = typed[type] || 0;
        if (have >= needed) {
            typed[type] = have - needed;
        } else {
            const deficit = needed - have;
            typed[type] = 0;
            if (wildFlex >= deficit) {
                wildFlex -= deficit;
            } else {
                return false;
            }
        }
    }

    const typedSurplus = Object.values(typed).reduce((a, b) => a + b, 0);
    return typedSurplus + colorlessFlex + wildFlex >= colorlessRequired;
}

export function canRetreat(instance: PokemonInstance): boolean {
    return instance.attachedEnergy.length >= instance.retreatCostCount;
}

// ---------------------------------------------------------------------------
// TCGPlayer
// ---------------------------------------------------------------------------

export class TCGPlayer {
    userid: string;
    deck: InGameCard[] = [];
    hand: InGameCard[] = [];
    active: PokemonInstance | null = null;
    bench: (PokemonInstance | null)[] = [null, null, null, null, null];
    prizes: InGameCard[] = [];
    discard: InGameCard[] = [];
    lostZone: InGameCard[] = [];

    hasRetreatedThisTurn = false;
    selectedUid: number | null = null;

    pendingEffect: {
        type: 'discard_for_effect' | 'pick_from_discard' | 'pick_from_deck' | 'use_power';
        trainerUid: number;
        trainerName: string;
        needed: number;
        selected: number[];
        filter?: string;
    } | null = null;

    pendingPromotion: boolean = false;

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

    findInPlay(uid: number): PokemonInstance | null {
        return this.getAllInPlay().find(i => i.uid === uid) ?? null;
    }

    benchSlotOf(inst: PokemonInstance): number {
        return this.bench.findIndex(b => b?.uid === inst.uid);
    }

    firstEmptyBenchSlot(): number {
        return this.bench.findIndex(b => b === null);
    }
}

// ---------------------------------------------------------------------------
// Deck validation
// ---------------------------------------------------------------------------

export interface DeckValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateDeck(cards: TCGCard[]): DeckValidationResult {
    const errors: string[] = [];

    if (cards.length !== 60) errors.push(`Deck has ${cards.length} cards; must be exactly 60.`);

    const counts: Record<string, number> = {};
    let hasBasic = false;

    for (const card of cards) {
        if (isBasicPokemon(card)) hasBasic = true;
        if (!isEnergyCard(card) || card.subtypes?.includes('Special')) {
            counts[card.name] = (counts[card.name] || 0) + 1;
        }
    }

    for (const [name, count] of Object.entries(counts)) {
        if (count > 4) errors.push(`${name} appears ${count} times; maximum is 4.`);
    }

    if (!hasBasic) errors.push('Deck must contain at least one Basic Pokémon.');

    return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Damage calculation context
// ---------------------------------------------------------------------------

export interface DamageContext {
    baseDamage: number;
    attackerTypes: string[];
    defenderInstance: PokemonInstance;
    attackIndex: number;
    coinResults: boolean[];
    extraDamage: number;
    benchDamage: { instanceUid: number; amount: number }[];
    selfDamage: number;
    applyWeaknessResistance: boolean;
    skipKnockout: boolean;
    statusToApply: VolatileStatus | null;
    poisonToApply: boolean;
    burnToApply: boolean;
    discardAttackerEnergy: number;
    discardAttackerEnergyTypes: string[];
    protectDefender: boolean;
    preventAllDamage: boolean;
    customLog: string[];
}

export function freshDamageContext(
    baseDamage: number,
    attackerTypes: string[],
    defenderInstance: PokemonInstance,
    attackIndex: number
): DamageContext {
    return {
        baseDamage,
        attackerTypes,
        defenderInstance,
        attackIndex,
        coinResults: [],
        extraDamage: 0,
        benchDamage: [],
        selfDamage: 0,
        applyWeaknessResistance: true,
        skipKnockout: false,
        statusToApply: null,
        poisonToApply: false,
        burnToApply: false,
        discardAttackerEnergy: 0,
        discardAttackerEnergyTypes: [],
        protectDefender: false,
        preventAllDamage: false,
        customLog: [],
    };
}

// ---------------------------------------------------------------------------
// TCGMatch
// ---------------------------------------------------------------------------

export class TCGMatch {
    player: TCGPlayer;
    ai: TCGPlayer;
    turn: 'player' | 'ai' = 'player';
    winner: 'player' | 'ai' | null = null;
    logs: string[] = [];

    hasAttachedEnergy = false;
    hasAttackedThisTurn = false;
    turnNumber = 0;

    readonly cardPool: TCGCard[];
    private cardUidCounter = 0;

    constructor(userid: string, cardPool: TCGCard[], playerDeck?: TCGCard[], aiDeck?: TCGCard[]) {
        this.cardPool = cardPool;
        this.player = new TCGPlayer(userid);
        this.ai = new TCGPlayer('AI');

        this.player.deck = this.buildDeck(playerDeck ?? this.generateTestDeck(cardPool));
        this.ai.deck = this.buildDeck(aiDeck ?? this.generateTestDeck(cardPool));

        this.setupGame();
    }

    private buildDeck(cards: TCGCard[]): InGameCard[] {
        return cards.map(c => ({ ...c, uid: this.cardUidCounter++ }));
    }

    private setupGame() {
        this.shuffleDeck(this.player.deck);
        this.shuffleDeck(this.ai.deck);

        let playerMulligans = 0;
        let aiMulligans = 0;

        while (!this.player.deck.some(c => isBasicPokemon(c))) {
            this.shuffleDeck(this.player.deck);
            playerMulligans++;
        }
        while (!this.ai.deck.some(c => isBasicPokemon(c))) {
            this.shuffleDeck(this.ai.deck);
            aiMulligans++;
        }

        this.player.draw(7);
        this.ai.draw(7);

        if (aiMulligans > 0) {
            for (let i = 0; i < aiMulligans; i++) this.player.draw(1);
            this.addLog(`AI took ${aiMulligans} mulligan(s). Player draws ${aiMulligans} card(s).`);
        }
        if (playerMulligans > 0) {
            for (let i = 0; i < playerMulligans; i++) this.ai.draw(1);
            this.addLog(`Player took ${playerMulligans} mulligan(s). AI draws ${playerMulligans} card(s).`);
        }

        for (let i = 0; i < 6; i++) {
            this.player.prizes.push(this.player.deck.shift()!);
            this.ai.prizes.push(this.ai.deck.shift()!);
        }

        this.turnNumber = 1;
        this.addLog(`Match started! Turn ${this.turnNumber} — Player's turn.`);
    }

    private shuffleDeck(deck: InGameCard[]) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    private generateTestDeck(pool: TCGCard[]): TCGCard[] {
        const find = (name: string): TCGCard => {
            const card = pool.find(c => c.name === name);
            if (!card) throw new Error(`Test deck: "${name}" not found in pool.`);
            return card;
        };

        const recipe: [TCGCard, number][] = [
            [find('Abra'),        4],
            [find('Kadabra'),     2],
            [find('Alakazam'),    2],
            [find('Electabuzz'),  2],
            [find('Hitmonchan'),  2],
            [find('Magikarp'),    2],
            [find('Gyarados'),    2],
            [find('Gastly'),      1],

            [find('Psychic Energy'),         4],
            [find('Lightning Energy'),        4],
            [find('Fighting Energy'),         3],
            [find('Double Colorless Energy'), 3],

            [find('Bill'),                   2],
            [find('Professor Oak'),          2],
            [find('Impostor Professor Oak'), 1],
            [find('Lass'),                   1],
            [find('Full Heal'),              1],
            [find('Pokémon Center'),         1],

            [find('Potion'),           2],
            [find('Super Potion'),     1],
            [find('Switch'),           1],
            [find('Scoop Up'),         1],
            [find('Defender'),         1],
            [find('PlusPower'),        2],
            [find('Devolution Spray'), 1],
            [find('Pokémon Breeder'),  1],
            [find('Revive'),           1],

            [find('Gust of Wind'),         1],
            [find('Energy Removal'),       1],
            [find('Super Energy Removal'), 1],
            [find('Pokémon Flute'),        1],

            [find('Computer Search'), 1],
            [find('Item Finder'),     1],
            [find('Maintenance'),     1],
            [find('Pokémon Trader'),  1],
            [find('Energy Retrieval'),1],
            [find('Pokédex'),         1],
        ];

        const total = recipe.reduce((s, [, n]) => s + n, 0);
        if (total !== 60) throw new Error(`Test deck has ${total} cards, expected 60.`);

        const deck: TCGCard[] = [];
        for (const [card, copies] of recipe) {
            for (let i = 0; i < copies; i++) deck.push(card);
        }
        return deck;
    }

    addLog(msg: string) {
        this.logs.unshift(msg);
        if (this.logs.length > 30) this.logs.pop();
    }

    // -----------------------------------------------------------------------
    // Internal helpers
    // -----------------------------------------------------------------------

    private playerOf(isPlayer: boolean): TCGPlayer {
        return isPlayer ? this.player : this.ai;
    }

    private opponentOf(isPlayer: boolean): TCGPlayer {
        return isPlayer ? this.ai : this.player;
    }

    private label(isPlayer: boolean): string {
        return isPlayer ? 'Player' : 'AI';
    }

    private expireItems(forPlayer: boolean, timing: 'end_of_your_turn' | 'end_of_opponent_turn') {
        const owner = this.playerOf(forPlayer);
        for (const inst of owner.getAllInPlay()) {
            const expired = inst.attachedItems.filter(i => i.expiresOn === timing);
            for (const item of expired) {
                owner.discard.push(item.card);
                this.addLog(`${item.card.name} on ${inst.topCard.name} expired.`);
            }
            inst.attachedItems = inst.attachedItems.filter(i => i.expiresOn !== timing);
        }
    }

    private clearPerTurnFlags(inst: PokemonInstance) {
        inst.protectedThisTurn = false;
        inst.damageModThisTurn = 0;
    }

    // -----------------------------------------------------------------------
    // Pokémon Checkup — runs between turns
    // -----------------------------------------------------------------------

    performCheckup(forPlayer: boolean) {
        const owner = this.playerOf(forPlayer);
        const inst = owner.active;
        if (!inst || this.winner) return;

        if (inst.status.poisoned) {
            inst.currentDamage += 10;
            this.addLog(`${inst.topCard.name} is Poisoned — 10 damage!`);
            if (inst.isKnockedOut()) { this.processKnockout(forPlayer); return; }
        }

        if (inst.status.burned) {
            inst.currentDamage += 20;
            this.addLog(`${inst.topCard.name} is Burned — 20 damage!`);
            if (inst.isKnockedOut()) { this.processKnockout(forPlayer); return; }
            if (flipCoin()) {
                inst.status.burned = false;
                this.addLog(`${inst.topCard.name} recovered from Burn!`);
            }
        }

        if (inst.status.volatile === 'asleep') {
            if (flipCoin()) {
                inst.status.volatile = null;
                this.addLog(`${inst.topCard.name} woke up!`);
            } else {
                this.addLog(`${inst.topCard.name} is still Asleep.`);
            }
        }

        if (inst.status.volatile === 'paralyzed') {
            inst.status.volatile = null;
            this.addLog(`${inst.topCard.name} recovered from Paralysis.`);
        }
    }

    // -----------------------------------------------------------------------
    // Damage pipeline
    // -----------------------------------------------------------------------

    computeFinalDamage(
        rawDamage: number,
        attackerTypes: string[],
        defenderCard: TCGCard,
        applyWR: boolean
    ): { final: number; weaknessApplied: boolean; resistanceApplied: boolean } {
        let damage = rawDamage;
        let weaknessApplied = false;
        let resistanceApplied = false;

        if (damage === 0 || !applyWR) return { final: damage, weaknessApplied, resistanceApplied };

        for (const atkType of attackerTypes) {
            const weakness = defenderCard.weaknesses?.find(w => w.type === atkType);
            if (weakness) {
                const v = weakness.value;
                if (v.startsWith('×') || v.startsWith('x') || v.startsWith('*')) {
                    const mult = parseFloat(v.replace(/[×x*]/, ''));
                    damage = Math.floor(damage * (isNaN(mult) ? 2 : mult));
                } else {
                    const flat = parseInt(v.replace(/[^0-9]/g, ''));
                    damage += isNaN(flat) ? 0 : flat;
                }
                weaknessApplied = true;
            }

            const resistance = defenderCard.resistances?.find(r => r.type === atkType);
            if (resistance) {
                const flat = parseInt(resistance.value.replace(/[^0-9]/g, ''));
                damage = Math.max(0, damage - (isNaN(flat) ? 30 : flat));
                resistanceApplied = true;
            }
        }

        return { final: damage, weaknessApplied, resistanceApplied };
    }

    applyDamageToInstance(inst: PokemonInstance, amount: number, isPlayerOwned: boolean, applyWR = false, attackerTypes: string[] = []) {
        if (inst.protectedThisTurn || amount <= 0) return;
        let dmg = amount;
        if (applyWR) {
            const { final } = this.computeFinalDamage(amount, attackerTypes, inst.topCard, true);
            dmg = final;
        }
        inst.currentDamage += dmg;
        if (inst.isKnockedOut()) this.processKnockout(isPlayerOwned);
    }

    // -----------------------------------------------------------------------
    // Knockout / prize
    // -----------------------------------------------------------------------

    processKnockout(isPlayerKnockedOut: boolean) {
        const victim = this.playerOf(isPlayerKnockedOut);
        const attacker = this.opponentOf(isPlayerKnockedOut);

        const inst = victim.active;
        if (!inst) return;

        this.addLog(`${inst.topCard.name} was Knocked Out!`);
        victim.discard.push(...inst.cards, ...inst.attachedEnergy);
        for (const item of inst.attachedItems) victim.discard.push(item.card);
        victim.active = null;
        victim.pendingPromotion = true;

        const prizesToTake = this.prizeCountForCard(inst.topCard);
        for (let i = 0; i < prizesToTake && attacker.prizes.length > 0; i++) {
            attacker.hand.push(attacker.prizes.shift()!);
        }
        if (prizesToTake > 0) this.addLog(`${this.label(!isPlayerKnockedOut)} took ${prizesToTake} Prize Card(s).`);

        if (attacker.prizes.length === 0) {
            this.declareWinner(!isPlayerKnockedOut, 'took all Prize Cards');
            return;
        }

        const hasBench = victim.bench.some(c => c !== null);
        if (!hasBench && victim.hand.every(c => !isBasicPokemon(c))) {
            this.declareWinner(!isPlayerKnockedOut, 'opponent has no Pokémon left');
        }
    }

    private prizeCountForCard(card: TCGCard): number {
        if (card.subtypes?.some(s => ['GX', 'EX', 'VMAX', 'VSTAR'].includes(s))) return 2;
        if (card.subtypes?.some(s => s === 'V')) return 2;
        if (card.rules?.some(r => r.toLowerCase().includes('prize'))) return 2;
        return 1;
    }

    private declareWinner(isPlayer: boolean, reason: string) {
        this.winner = isPlayer ? 'player' : 'ai';
        this.addLog(`${this.label(isPlayer)} wins! (${reason})`);
    }

    // -----------------------------------------------------------------------
    // Playing Basic Pokémon
    // -----------------------------------------------------------------------

    playBasicPokemon(isPlayer: boolean, uid: number, slot: 'active' | number): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isBasicPokemon(card)) return false;

        if (slot === 'active') {
            if (activePlayer.active) return false;
            activePlayer.active = new PokemonInstance(card, this.turnNumber);
            activePlayer.hand.splice(handIndex, 1);
            activePlayer.pendingPromotion = false;
            this.addLog(`${this.label(isPlayer)} set ${card.name} as Active Pokémon.`);
        } else {
            if (activePlayer.bench[slot as number]) return false;
            activePlayer.bench[slot as number] = new PokemonInstance(card, this.turnNumber);
            activePlayer.hand.splice(handIndex, 1);
            this.addLog(`${this.label(isPlayer)} benched ${card.name}.`);
        }

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    // -----------------------------------------------------------------------
    // Evolution
    // -----------------------------------------------------------------------

    private getBasicNameForStage2(stage2Card: TCGCard): string | null {
        let current: TCGCard | undefined = stage2Card;
        const visited = new Set<string>();
        while (current?.evolvesFrom) {
            if (visited.has(current.name)) return null;
            visited.add(current.name);
            const parent = this.cardPool.find(c => c.name === current!.evolvesFrom);
            if (!parent) return current.evolvesFrom;
            current = parent;
        }
        return current?.name ?? null;
    }

    evolvePokemon(isPlayer: boolean, uid: number, slot: 'active' | number, skipStageCheck = false): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isEvolutionPokemon(card) || !card.evolvesFrom) return false;

        const targetInstance = slot === 'active' ? activePlayer.active : activePlayer.bench[slot as number];
        if (!targetInstance) return false;

        if (skipStageCheck) {
            if (!card.subtypes?.includes('Stage 2')) return false;
            if (targetInstance.stage !== 0) return false;
            const requiredBasic = this.getBasicNameForStage2(card);
            if (!requiredBasic || targetInstance.topCard.name !== requiredBasic) return false;
            if (targetInstance.turnPlaced >= this.turnNumber) return false;
        } else {
            if (targetInstance.topCard.name !== card.evolvesFrom) return false;
            if (targetInstance.turnPlaced >= this.turnNumber) return false;
        }

        targetInstance.cards.push(card);
        targetInstance.clearAllStatus();
        activePlayer.hand.splice(handIndex, 1);
        this.addLog(`${this.label(isPlayer)} evolved ${card.evolvesFrom} into ${card.name}${skipStageCheck ? ' (Pokémon Breeder)' : ''}.`);

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    // -----------------------------------------------------------------------
    // Energy attachment
    // -----------------------------------------------------------------------

    attachEnergy(isPlayer: boolean, uid: number, slot: 'active' | number): boolean {
        if (this.winner || this.hasAttachedEnergy) return false;

        const activePlayer = this.playerOf(isPlayer);
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isEnergyCard(card)) return false;

        const targetInstance = slot === 'active' ? activePlayer.active : activePlayer.bench[slot as number];
        if (!targetInstance) return false;

        targetInstance.attachedEnergy.push(card);
        activePlayer.hand.splice(handIndex, 1);
        this.hasAttachedEnergy = true;

        if (card.name === 'Rainbow Energy') {
            targetInstance.currentDamage += 10;
            this.addLog(`${this.label(isPlayer)} attached Rainbow Energy to ${targetInstance.topCard.name} (takes 10 damage).`);
            if (targetInstance.isKnockedOut()) {
                this.processKnockout(isPlayer);
                if (isPlayer) activePlayer.selectedUid = null;
                return true;
            }
        } else {
            this.addLog(`${this.label(isPlayer)} attached ${card.name} to ${targetInstance.topCard.name}.`);
        }

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    // -----------------------------------------------------------------------
    // Retreat
    // -----------------------------------------------------------------------

    retreat(isPlayer: boolean, benchIndex: number): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        if (activePlayer.hasRetreatedThisTurn) {
            this.addLog(`${this.label(isPlayer)} already retreated this turn.`);
            return false;
        }

        const active = activePlayer.active;
        if (!active) return false;

        if (active.status.volatile === 'asleep' || active.status.volatile === 'paralyzed') {
            this.addLog(`${active.topCard.name} cannot retreat while ${active.status.volatile}!`);
            return false;
        }

        const cost = active.retreatCostCount;
        if (active.attachedEnergy.length < cost) {
            this.addLog(`Not enough Energy to retreat (needs ${cost}).`);
            return false;
        }

        const target = activePlayer.bench[benchIndex];
        if (!target) return false;

        for (let i = 0; i < cost; i++) {
            activePlayer.discard.push(active.attachedEnergy.pop()!);
        }

        active.clearVolatileStatus();
        activePlayer.active = target;
        activePlayer.bench[benchIndex] = active;
        activePlayer.hasRetreatedThisTurn = true;

        this.addLog(`${this.label(isPlayer)} retreated ${active.topCard.name}, sending out ${target.topCard.name}.`);
        return true;
    }

    // -----------------------------------------------------------------------
    // Promote from bench after KO
    // -----------------------------------------------------------------------

    promote(isPlayer: boolean, benchIndex: number): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        if (activePlayer.active !== null) return false;

        const instance = activePlayer.bench[benchIndex];
        if (!instance) return false;

        activePlayer.active = instance;
        activePlayer.bench[benchIndex] = null;
        activePlayer.pendingPromotion = false;
        this.addLog(`${this.label(isPlayer)} promoted ${instance.topCard.name} to Active.`);
        return true;
    }

    // -----------------------------------------------------------------------
    // Status helpers
    // -----------------------------------------------------------------------

    applyVolatileStatus(isPlayer: boolean, status: VolatileStatus): boolean {
        const inst = this.playerOf(isPlayer).active;
        if (!inst || status === null) return false;
        if (inst.status.volatile !== null) return false;
        inst.status.volatile = status;
        this.addLog(`${inst.topCard.name} is now ${status}!`);
        return true;
    }

    applyPoison(isPlayer: boolean): boolean {
        const inst = this.playerOf(isPlayer).active;
        if (!inst) return false;
        if (inst.status.poisoned) return false;
        inst.status.poisoned = true;
        this.addLog(`${inst.topCard.name} is now Poisoned!`);
        return true;
    }

    applyBurn(isPlayer: boolean): boolean {
        const inst = this.playerOf(isPlayer).active;
        if (!inst) return false;
        if (inst.status.burned) return false;
        inst.status.burned = true;
        this.addLog(`${inst.topCard.name} is now Burned!`);
        return true;
    }

    clearStatus(isPlayer: boolean): boolean {
        const inst = this.playerOf(isPlayer).active;
        if (!inst) return false;
        inst.clearAllStatus();
        return true;
    }

    // -----------------------------------------------------------------------
    // Trainer cards
    // -----------------------------------------------------------------------

    playTrainer(isPlayer: boolean, uid: number, targetSlot?: 'active' | number): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (!isTrainerCard(card)) return false;

        const effect = TrainerEffects[card.id] ?? TrainerEffects[card.name];
        if (!effect) {
            if (isPlayer) this.addLog(`${card.name} has no implemented effect yet.`);
            return false;
        }

        if (effect.requiresTarget && targetSlot === undefined) return false;

        const success = effect.execute(this, isPlayer, card, targetSlot);
        if (success) {
            // Recalculate index in case the effect mutated the hand
            const currentIdx = activePlayer.hand.findIndex(c => c.uid === uid);
            if (currentIdx !== -1) {
                activePlayer.hand.splice(currentIdx, 1);
            }
            activePlayer.discard.push(card);
            
            if (isPlayer) activePlayer.selectedUid = null;
        }
        return success;
    }

    // -----------------------------------------------------------------------
    // Pokémon Powers
    // -----------------------------------------------------------------------

    usePokemonPower(isPlayer: boolean, instanceUid: number, powerIndex = 0, targetData?: unknown): boolean {
        if (this.winner) return false;

        const activePlayer = this.playerOf(isPlayer);
        const inst = activePlayer.findInPlay(instanceUid);
        if (!inst) return false;

        const power = inst.topCard.abilities?.[powerIndex];
        if (!power) return false;

        if (inst.isPowerBlocked()) {
            this.addLog(`${inst.topCard.name}'s ${power.name} is blocked by ${inst.status.volatile}!`);
            return false;
        }

        const powerType = power.type;
        if (powerType === 'Poké-Body' || powerType === 'Ability') {
            this.addLog(`${power.name} is a passive ability — it applies automatically.`);
            return false;
        }

        return resolvePokemonPower(this, isPlayer, inst, power, targetData);
    }

    // -----------------------------------------------------------------------
    // Attack
    // -----------------------------------------------------------------------

    attack(isPlayer: boolean, attackIndex: number): boolean {
        if (this.winner) return false;
        if (this.hasAttackedThisTurn) return false;

        const attacker = this.playerOf(isPlayer);
        const defender = this.opponentOf(isPlayer);

        if (!attacker.active || !defender.active) return false;

        const attackerInst = attacker.active;
        const defenderInst = defender.active;

        const vol = attackerInst.status.volatile;

        if (vol === 'asleep' || vol === 'paralyzed') {
            this.addLog(`${attackerInst.topCard.name} is ${vol} and cannot attack!`);
            return false;
        }

        if (vol === 'confused') {
            const hit = flipCoin();
            this.addLog(`${attackerInst.topCard.name} is Confused — coin flip: ${hit ? 'heads (attacks normally)' : 'tails (hurts itself)'}`);
            if (!hit) {
                const selfCtx = freshDamageContext(20, attackerInst.topCard.types ?? [], attackerInst, attackIndex);
                selfCtx.applyWeaknessResistance = true;
                const { final } = this.computeFinalDamage(20, attackerInst.topCard.types ?? [], attackerInst.topCard, true);
                attackerInst.currentDamage += final;
                this.addLog(`${attackerInst.topCard.name} hurt itself for ${final} damage (Confusion — WOTC rule)!`);
                if (attackerInst.isKnockedOut()) this.processKnockout(isPlayer);
                this.finishAttack(isPlayer);
                return true;
            }
        }

        if (!hasEnoughEnergy(attackerInst, attackIndex)) return false;

        const attackDef = attackerInst.topCard.attacks?.[attackIndex];
        if (!attackDef) return false;

        const damageRaw = parseInt(attackDef.damage.replace(/[^0-9]/g, ''));
        const baseDamage = isNaN(damageRaw) ? 0 : damageRaw;

        this.addLog(`${attackerInst.topCard.name} used ${attackDef.name}!`);

        const ctx = freshDamageContext(
            baseDamage,
            attackerInst.topCard.types ?? [],
            defenderInst,
            attackIndex
        );

        resolveAttackEffect(this, isPlayer, attackerInst, defenderInst, attackDef, ctx);

        for (const msg of ctx.customLog) this.addLog(msg);

        if (!ctx.preventAllDamage) {
            let damage = ctx.baseDamage + ctx.extraDamage;

            const plusPowers = attackerInst.attachedItems.filter(i => i.card.name === 'PlusPower').length;
            if (plusPowers > 0) {
                damage += plusPowers * 10;
                this.addLog(`PlusPower: +${plusPowers * 10} damage.`);
            }

            const defenders = defenderInst.attachedItems.filter(i => i.card.name === 'Defender').length;
            if (defenders > 0 && damage > 0) {
                damage = Math.max(0, damage - defenders * 20);
                this.addLog(`Defender: -${defenders * 20} damage.`);
            }

            if (damage > 0 && !defenderInst.protectedThisTurn) {
                const { final, weaknessApplied, resistanceApplied } = this.computeFinalDamage(
                    damage,
                    ctx.attackerTypes,
                    defenderInst.topCard,
                    ctx.applyWeaknessResistance
                );
                if (weaknessApplied) this.addLog(`Weakness! Damage doubled.`);
                if (resistanceApplied) this.addLog(`Resistance! Damage reduced.`);
                damage = final;

                defenderInst.currentDamage += damage;
                this.addLog(`${attackDef.name} dealt ${damage} to ${defenderInst.topCard.name}.`);

                if (defenderInst.isKnockedOut()) this.processKnockout(!isPlayer);
            }
        }

        if (ctx.selfDamage > 0 && !this.winner) {
            attackerInst.currentDamage += ctx.selfDamage;
            this.addLog(`${attackerInst.topCard.name} took ${ctx.selfDamage} recoil damage.`);
            if (attackerInst.isKnockedOut()) this.processKnockout(isPlayer);
        }

        if (!this.winner) {
            for (const { instanceUid, amount } of ctx.benchDamage) {
                const playerInst = this.player.findInPlay(instanceUid);
                const aiInst = this.ai.findInPlay(instanceUid);
                if (playerInst) {
                    playerInst.currentDamage += amount;
                    this.addLog(`${playerInst.topCard.name} took ${amount} bench damage.`);
                    if (playerInst.isKnockedOut()) this.processKnockout(true);
                } else if (aiInst) {
                    aiInst.currentDamage += amount;
                    this.addLog(`${aiInst.topCard.name} took ${amount} bench damage.`);
                    if (aiInst.isKnockedOut()) this.processKnockout(false);
                }
            }
        }

        if (ctx.discardAttackerEnergy > 0 && !this.winner) {
            for (let i = 0; i < ctx.discardAttackerEnergy && attackerInst.attachedEnergy.length > 0; i++) {
                let discarded = false;
                if (ctx.discardAttackerEnergyTypes.length > 0) {
                    const targetType = ctx.discardAttackerEnergyTypes[i % ctx.discardAttackerEnergyTypes.length];
                    const idx = attackerInst.attachedEnergy.findIndex(e => e.name === `${targetType} Energy`);
                    if (idx !== -1) {
                        attacker.discard.push(attackerInst.attachedEnergy.splice(idx, 1)[0]);
                        discarded = true;
                    }
                }
                if (!discarded) {
                    attacker.discard.push(attackerInst.attachedEnergy.pop()!);
                }
            }
            this.addLog(`${attackerInst.topCard.name} discarded ${ctx.discardAttackerEnergy} Energy.`);
        }

        if (!this.winner) {
            if (ctx.statusToApply !== null) this.applyVolatileStatus(!isPlayer, ctx.statusToApply);
            if (ctx.poisonToApply) this.applyPoison(!isPlayer);
            if (ctx.burnToApply) this.applyBurn(!isPlayer);
        }

        this.finishAttack(isPlayer);
        return true;
    }

    private finishAttack(isPlayer: boolean) {
        if (!this.winner) this.performCheckup(isPlayer);

        this.expireItems(isPlayer, 'end_of_your_turn');
        this.expireItems(!isPlayer, 'end_of_opponent_turn');
        
        const owner = this.playerOf(isPlayer);
        owner.hasRetreatedThisTurn = false;

        // CRITICAL FIX: Clear the NEXT player's turn flags at the start of their turn!
        // This ensures moves like Agility and Barrier properly protect you during their turn.
        const nextPlayer = this.playerOf(!isPlayer);
        for (const inst of nextPlayer.getAllInPlay()) this.clearPerTurnFlags(inst);

        if (isPlayer) this.player.selectedUid = null;
        
        if (!this.winner) {
            this.hasAttackedThisTurn = false;
            this.hasAttachedEnergy = false;
            this.turn = isPlayer ? 'ai' : 'player';
            if (this.turn === 'ai') this.executeAITurn();
        }
    }

    // -----------------------------------------------------------------------
    // End player turn
    // -----------------------------------------------------------------------

    endPlayerTurn() {
        if (this.winner) return;
        this.performCheckup(true);
        if (this.winner) return;
        this.expireItems(true, 'end_of_your_turn');
        this.expireItems(false, 'end_of_opponent_turn');
        
        // Shift protection logic. Clear the AI's flags before they start their turn.
        for (const inst of this.ai.getAllInPlay()) this.clearPerTurnFlags(inst);

        this.player.selectedUid = null;
        this.player.hasRetreatedThisTurn = false;
        this.hasAttachedEnergy = false;
        this.hasAttackedThisTurn = false;
        this.turn = 'ai';
        this.executeAITurn();
    }

    // -----------------------------------------------------------------------
    // AI Turn
    // -----------------------------------------------------------------------

    executeAITurn() {
        if (this.winner) return;
        this.addLog(`AI's turn (turn ${this.turnNumber}).`);
        this.turnNumber++;

        if (!this.ai.draw(1)) {
            this.declareWinner(true, 'AI ran out of cards');
            return;
        }

        if (this.ai.pendingPromotion) {
            const benchIdx = this.ai.bench.findIndex(b => b !== null);
            if (benchIdx !== -1) {
                this.promote(false, benchIdx);
            } else {
                const basic = this.ai.hand.find(c => isBasicPokemon(c));
                if (basic) this.playBasicPokemon(false, (basic as InGameCard).uid, 'active');
                else { this.declareWinner(true, 'AI has no Pokémon to promote'); return; }
            }
        }

        for (const card of [...this.ai.hand]) {
            if (!this.ai.hand.some(c => c.uid === card.uid)) continue;

            if (isTrainerCard(card)) {
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
                if (basic) this.playBasicPokemon(false, (basic as InGameCard).uid, 'active');
            }
        }

        for (const card of [...this.ai.hand]) {
            if (isBasicPokemon(card)) {
                const slot = this.ai.firstEmptyBenchSlot();
                if (slot !== -1) this.playBasicPokemon(false, (card as InGameCard).uid, slot);
            } else if (isEvolutionPokemon(card)) {
                const evFrom = card.evolvesFrom;
                if (this.ai.active?.topCard.name === evFrom) {
                    this.evolvePokemon(false, (card as InGameCard).uid, 'active');
                } else {
                    const bi = this.ai.bench.findIndex(b => b?.topCard.name === evFrom);
                    if (bi !== -1) this.evolvePokemon(false, (card as InGameCard).uid, bi);
                }
            }
        }

        // ---- AI Pokémon Powers ----
        let powerUsed = true;
        let powerLoops = 0;
        while (powerUsed && powerLoops < 5 && !this.winner) {
            powerUsed = false;
            powerLoops++;
            
            for (const inst of this.ai.getAllInPlay()) {
                if (inst.isPowerBlocked()) continue;
                
                for (let pIdx = 0; pIdx < (inst.topCard.abilities?.length || 0); pIdx++) {
                    const power = inst.topCard.abilities![pIdx];
                    if (power.type !== 'Pokémon Power' && power.type !== 'Poké-Power') continue;

                    if (power.name === 'Rain Dance') {
                        const waterIdx = this.ai.hand.findIndex(c => c.name === 'Water Energy');
                        if (waterIdx !== -1) {
                            const target = this.ai.active?.topCard.types?.includes('Water') ? this.ai.active : this.ai.bench.find(b => b?.topCard.types?.includes('Water'));
                            if (target) {
                                const targetSlot = target === this.ai.active ? 'active' : this.ai.benchSlotOf(target);
                                if (this.usePokemonPower(false, inst.uid, pIdx, { energyUid: this.ai.hand[waterIdx].uid, targetSlot })) {
                                    powerUsed = true;
                                }
                            }
                        }
                    } else if (power.name === 'Damage Swap') {
                        if (this.ai.active && this.ai.active.currentDamage > 0) {
                            const healthyBench = this.ai.bench.find(b => b && b.currentDamage === 0 && b.maxHP >= 50);
                            if (healthyBench) {
                                if (this.usePokemonPower(false, inst.uid, pIdx, { fromUid: this.ai.active.uid, toUid: healthyBench.uid })) {
                                    powerUsed = true;
                                }
                            }
                        }
                    } else if (power.name === 'Energy Trans') {
                        if (this.ai.active && this.ai.active.attachedEnergy.length < 3) {
                            const benchedWithGrass = this.ai.bench.find(b => b && b.attachedEnergy.some(e => e.name === 'Grass Energy'));
                            if (benchedWithGrass) {
                                const grassEnergy = benchedWithGrass.attachedEnergy.find(e => e.name === 'Grass Energy');
                                if (grassEnergy && this.usePokemonPower(false, inst.uid, pIdx, { energyUid: grassEnergy.uid, fromUid: benchedWithGrass.uid, toUid: this.ai.active.uid })) {
                                    powerUsed = true;
                                }
                            }
                        }
                    } else if (power.name === 'Energy Burn') {
                        if (inst === this.ai.active && inst.attachedEnergy.some(e => e.name !== 'Fire Energy')) {
                            if (this.usePokemonPower(false, inst.uid, pIdx, {})) {
                                powerUsed = true;
                            }
                        }
                    } else if (power.name === 'Lure' && powerLoops === 1) { 
                        const fireIdx = this.ai.hand.findIndex(c => c.name === 'Fire Energy');
                        if (fireIdx !== -1) {
                            const weakBenchIdx = this.player.bench.findIndex(b => b && b.currentHP <= 50);
                            if (weakBenchIdx !== -1) {
                                if (this.usePokemonPower(false, inst.uid, pIdx, { energyUid: this.ai.hand[fireIdx].uid, benchIndex: weakBenchIdx })) {
                                    powerUsed = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!this.hasAttachedEnergy && this.ai.active) {
            const energy = this.ai.hand.find(c => isEnergyCard(c));
            if (energy) this.attachEnergy(false, (energy as InGameCard).uid, 'active');
        }

        let attacked = false;
        const aiActive = this.ai.active;
        if (aiActive && aiActive.topCard.attacks && !this.winner) {
            const vol = aiActive.status.volatile;
            if (vol !== 'asleep' && vol !== 'paralyzed') {
                for (let i = aiActive.topCard.attacks.length - 1; i >= 0; i--) {
                    if (hasEnoughEnergy(aiActive, i)) {
                        attacked = this.attack(false, i);
                        break;
                    }
                }
            }
        }

        if (!attacked && !this.winner) {
            this.performCheckup(false);
            this.expireItems(false, 'end_of_your_turn');
            this.expireItems(true, 'end_of_opponent_turn');
            
            // Shift protection logic. Clear the player's flags before they start their turn.
            for (const inst of this.player.getAllInPlay()) this.clearPerTurnFlags(inst);
            this.ai.hasRetreatedThisTurn = false;

            this.addLog('AI ends turn without attacking.');
            this.turn = 'player';
            this.hasAttachedEnergy = false;
            this.hasAttackedThisTurn = false;
        }

        if (this.turn === 'player' && !this.winner) {
            this.turnNumber++;
            if (!this.player.draw(1)) {
                this.declareWinner(false, 'Player ran out of cards');
            } else {
                this.addLog(`Player draws a card (turn ${this.turnNumber}).`);
            }
        }
    }
}
