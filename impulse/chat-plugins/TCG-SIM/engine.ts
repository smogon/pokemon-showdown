import { TrainerEffects } from './effects';

export interface WeaknessResistance {
    type: string;
    value: string;
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
    images: { small: string, large: string };
    attacks?: { name: string, cost: string[], damage: string, text: string }[];
}

export interface InGameCard extends TCGCard {
    uid: number;
}

export interface AttachedItem {
    card: InGameCard;
    expiresOn: 'end_of_your_turn' | 'end_of_opponent_turn';
}

export type StatusCondition = 'poisoned' | 'burned' | 'asleep' | 'confused' | 'paralyzed' | null;

export class PokemonInstance {
    uid: number;
    cards: InGameCard[];
    attachedEnergy: InGameCard[];
    attachedItems: AttachedItem[];
    currentDamage: number;
    turnPlaced: number;
    status: StatusCondition;

    constructor(basic: InGameCard, turnPlaced = 0) {
        this.uid = basic.uid;
        this.cards = [basic];
        this.attachedEnergy = [];
        this.attachedItems = [];
        this.currentDamage = 0;
        this.turnPlaced = turnPlaced;
        this.status = null;
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
}

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

    const typed: Record<string, number> = {};
    let colorlessFlex = 0;
    let wildFlex = 0;

    for (const energy of instance.attachedEnergy) {
        if (energy.name === 'Double Colorless Energy') {
            colorlessFlex += 2;
        } else if (energy.name === 'Rainbow Energy') {
            wildFlex += 1;
        } else {
            const type = energy.name.replace(' Energy', '');
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

export class TCGPlayer {
    userid: string;
    deck: InGameCard[] = [];
    hand: InGameCard[] = [];
    active: PokemonInstance | null = null;
    bench: (PokemonInstance | null)[] = [null, null, null, null, null];
    prizes: InGameCard[] = [];
    discard: InGameCard[] = [];

    selectedUid: number | null = null;
    pendingEffect: {
        type: 'discard_for_effect' | 'pick_from_discard' | 'pick_from_deck';
        trainerUid: number;
        trainerName: string;
        needed: number;
        selected: number[];
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
    hasAttackedThisTurn = false;
    turnNumber = 0;
    readonly cardPool: TCGCard[];
    private cardUidCounter = 0;

    constructor(userid: string, baseSetData: TCGCard[]) {
        this.cardPool = baseSetData;
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
        this.turnNumber = 1;
    }

    private generateDummyDeck(pool: TCGCard[]): InGameCard[] {
        const find = (name: string): TCGCard => {
            const card = pool.find(c => c.name === name);
            if (!card) throw new Error(`TCG test deck: card "${name}" not found in pool`);
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

        const total = recipe.reduce((sum, [, n]) => sum + n, 0);
        if (total !== 60) throw new Error(`TCG test deck has ${total} cards, expected 60`);

        const deck: InGameCard[] = [];
        for (const [card, copies] of recipe) {
            for (let i = 0; i < copies; i++) {
                deck.push({ ...card, uid: this.cardUidCounter++ });
            }
        }

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

    private processEndOfTurnStatus(forPlayer: boolean) {
        const owner = forPlayer ? this.player : this.ai;
        const inst = owner.active;
        if (!inst) return;

        if (inst.status === 'poisoned') {
            inst.currentDamage += 10;
            this.addLog(`${inst.topCard.name} is Poisoned and takes 10 damage!`);
            const hp = parseInt(inst.topCard.hp || '0');
            if (inst.currentDamage >= hp) {
                this.processKnockout(forPlayer);
                return;
            }
        }

        if (inst.status === 'burned') {
            inst.currentDamage += 20;
            this.addLog(`${inst.topCard.name} is Burned and takes 20 damage!`);
            const hp = parseInt(inst.topCard.hp || '0');
            if (inst.currentDamage >= hp) {
                this.processKnockout(forPlayer);
                return;
            }
        }

        if (inst.status === 'asleep') {
            const flip = Math.random() < 0.5;
            if (flip) {
                inst.status = null;
                this.addLog(`${inst.topCard.name} woke up!`);
            } else {
                this.addLog(`${inst.topCard.name} is still Asleep.`);
            }
        }

        if (inst.status === 'paralyzed') {
            inst.status = null;
            this.addLog(`${inst.topCard.name} is no longer Paralyzed.`);
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
            activePlayer.active = new PokemonInstance(card, this.turnNumber);
            activePlayer.hand.splice(handIndex, 1);
            this.addLog(`${isPlayer ? 'Player' : 'AI'} set ${card.name} as Active Pokémon.`);
        } else {
            if (activePlayer.bench[slot]) return false;
            activePlayer.bench[slot] = new PokemonInstance(card, this.turnNumber);
            activePlayer.hand.splice(handIndex, 1);
            this.addLog(`${isPlayer ? 'Player' : 'AI'} benched ${card.name}.`);
        }

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

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
        targetInstance.status = null;
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

        if (card.name === 'Rainbow Energy') {
            targetInstance.currentDamage += 10;
            this.addLog(`${isPlayer ? 'Player' : 'AI'} attached Rainbow Energy to ${targetInstance.topCard.name} (10 damage to itself).`);
            const hp = parseInt(targetInstance.topCard.hp || '0');
            if (targetInstance.currentDamage >= hp) {
                this.processKnockout(isPlayer);
                if (isPlayer) activePlayer.selectedUid = null;
                return true;
            }
        } else {
            this.addLog(`${isPlayer ? 'Player' : 'AI'} attached ${card.name} to ${targetInstance.topCard.name}.`);
        }

        if (isPlayer) activePlayer.selectedUid = null;
        return true;
    }

    retreat(isPlayer: boolean, benchIndex: number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const active = activePlayer.active;
        if (!active) return false;

        if (active.status === 'asleep' || active.status === 'paralyzed') {
            this.addLog(`${active.topCard.name} cannot retreat while ${active.status}!`);
            return false;
        }

        const cost = active.retreatCostCount;
        if (active.attachedEnergy.length < cost) {
            this.addLog(`Not enough Energy to retreat ${active.topCard.name} (needs ${cost}).`);
            return false;
        }

        const target = activePlayer.bench[benchIndex];
        if (!target) return false;

        for (let i = 0; i < cost; i++) {
            const discarded = active.attachedEnergy.pop()!;
            activePlayer.discard.push(discarded);
        }

        activePlayer.active = target;
        activePlayer.bench[benchIndex] = active;
        active.status = null;

        this.addLog(`${isPlayer ? 'Player' : 'AI'} retreated ${active.topCard.name}, sending out ${target.topCard.name}.`);
        return true;
    }

    applyStatus(isPlayer: boolean, status: StatusCondition) {
        const activePlayer = isPlayer ? this.player : this.ai;
        const inst = activePlayer.active;
        if (!inst) return false;
        if (inst.status !== null) return false;
        inst.status = status;
        this.addLog(`${inst.topCard.name} is now ${status}!`);
        return true;
    }

    clearStatus(isPlayer: boolean) {
        const activePlayer = isPlayer ? this.player : this.ai;
        const inst = activePlayer.active;
        if (!inst) return false;
        inst.status = null;
        return true;
    }

    playTrainer(isPlayer: boolean, uid: number, targetSlot?: 'active' | number) {
        if (this.winner) return false;

        const activePlayer = isPlayer ? this.player : this.ai;
        const handIndex = activePlayer.hand.findIndex(c => c.uid === uid);
        if (handIndex === -1) return false;

        const card = activePlayer.hand[handIndex];
        if (card.supertype !== 'Trainer') return false;

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

    private computeDamage(
        baseDamage: number,
        attackerTypes: string[],
        defenderCard: TCGCard
    ): { final: number; weaknessApplied: boolean; resistanceApplied: boolean } {
        let damage = baseDamage;
        let weaknessApplied = false;
        let resistanceApplied = false;

        if (damage === 0) return { final: 0, weaknessApplied, resistanceApplied };

        for (const atkType of attackerTypes) {
            const weakness = defenderCard.weaknesses?.find(w => w.type === atkType);
            if (weakness) {
                if (weakness.value.startsWith('×') || weakness.value.startsWith('x')) {
                    const mult = parseFloat(weakness.value.replace(/[×x]/, ''));
                    damage = Math.floor(damage * (isNaN(mult) ? 2 : mult));
                } else {
                    const flat = parseInt(weakness.value.replace(/[^0-9]/g, ''));
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

    attack(isPlayer: boolean, attackIndex: number) {
        if (this.winner) return false;

        const attacker = isPlayer ? this.player : this.ai;
        const defender = isPlayer ? this.ai : this.player;

        if (!attacker.active || !defender.active) return false;

        if (attacker.active.status === 'asleep' || attacker.active.status === 'paralyzed') {
            this.addLog(`${attacker.active.topCard.name} is ${attacker.active.status} and cannot attack!`);
            return false;
        }

        if (attacker.active.status === 'confused') {
            const flip = Math.random() < 0.5;
            if (flip) {
                attacker.active.currentDamage += 30;
                this.addLog(`${attacker.active.topCard.name} is Confused and hurt itself for 30 damage!`);
                const hp = parseInt(attacker.active.topCard.hp || '0');
                if (attacker.active.currentDamage >= hp) {
                    this.processKnockout(isPlayer);
                }
                this.expireItems(isPlayer, 'end_of_your_turn');
                this.expireItems(!isPlayer, 'end_of_opponent_turn');
                if (!this.winner) {
                    this.turn = isPlayer ? 'ai' : 'player';
                    this.hasAttackedThisTurn = true;
                    this.hasAttachedEnergy = false;
                    if (this.turn === 'ai') this.executeAITurn();
                }
                return true;
            }
        }

        if (isPlayer && this.turnNumber === 1) {
            this.addLog(`Cannot attack on the first turn!`);
            return false;
        }

        if (!hasEnoughEnergy(attacker.active, attackIndex)) return false;

        const attackUse = attacker.active.topCard.attacks?.[attackIndex];
        if (!attackUse) return false;

        const damageRaw = parseInt(attackUse.damage.replace(/[^0-9]/g, ''));
        let damage = isNaN(damageRaw) ? 0 : damageRaw;

        this.addLog(`${attacker.active.topCard.name} used ${attackUse.name}!`);

        if (damage > 0) {
            const plusPowers = attacker.active.attachedItems.filter(i => i.card.name === 'PlusPower').length;
            if (plusPowers > 0) {
                damage += plusPowers * 10;
                this.addLog(`PlusPower boosted the attack by ${plusPowers * 10}!`);
            }

            const defenders = defender.active.attachedItems.filter(i => i.card.name === 'Defender').length;
            if (defenders > 0) {
                damage = Math.max(0, damage - defenders * 20);
                this.addLog(`Defender reduced the damage by ${defenders * 20}!`);
            }

            const attackerTypes = attacker.active.topCard.types ?? [];
            const { final, weaknessApplied, resistanceApplied } = this.computeDamage(
                damage,
                attackerTypes,
                defender.active.topCard
            );

            if (weaknessApplied) this.addLog(`It's super effective! (Weakness ×2)`);
            if (resistanceApplied) this.addLog(`Resistance reduced the damage by 30.`);

            damage = final;
            defender.active.currentDamage += damage;
            this.addLog(`It dealt ${damage} damage to ${defender.active.topCard.name}.`);

            const hpRaw = parseInt(defender.active.topCard.hp || '0');
            if (defender.active.currentDamage >= hpRaw) {
                this.processKnockout(!isPlayer);
            }
        }

        this.expireItems(isPlayer, 'end_of_your_turn');
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

    endPlayerTurn() {
        this.processEndOfTurnStatus(true);
        if (this.winner) return;
        this.expireItems(true, 'end_of_your_turn');
        this.player.selectedUid = null;
        this.hasAttachedEnergy = false;
        this.hasAttackedThisTurn = false;
        this.turn = 'ai';
    }

    executeAITurn() {
        if (this.winner) return;
        this.addLog("AI is taking its turn...");
        this.turnNumber++;

        if (!this.ai.draw(1)) {
            this.winner = 'player';
            return;
        }

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
        const aiActive = this.ai.active;
        if (aiActive && aiActive.topCard.attacks && !this.winner) {
            const canAct = aiActive.status !== 'asleep' && aiActive.status !== 'paralyzed';
            if (canAct) {
                for (let i = aiActive.topCard.attacks.length - 1; i >= 0; i--) {
                    if (hasEnoughEnergy(aiActive, i)) {
                        attacked = this.attack(false, i);
                        break;
                    }
                }
            }
        }

        if (!attacked) {
            this.processEndOfTurnStatus(false);
        }

        if (!attacked) {
            this.expireItems(false, 'end_of_your_turn');
        }

        if (!attacked && !this.winner) {
            this.addLog("AI ends turn without attacking.");
            this.turn = 'player';
            this.hasAttachedEnergy = false;
        }

        this.expireItems(true, 'end_of_opponent_turn');

        if (this.turn === 'player' && !this.winner) {
            this.turnNumber++;
            if (!this.player.draw(1)) {
                this.winner = 'ai';
                this.addLog("Player ran out of cards! AI wins!");
            } else {
                this.addLog("Player draws a card for turn.");
            }
        }
    }
}
