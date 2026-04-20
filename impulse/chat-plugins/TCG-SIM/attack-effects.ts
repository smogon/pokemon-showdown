import type { TCGMatch, PokemonInstance, DamageContext } from './engine';
import { flipCoin, flipCoins, freshDamageContext } from './engine';
import type { CardAttack } from './engine';

// ---------------------------------------------------------------------------
// Attack Effect Resolver
//
// Architecture:
//   1. resolveAttackEffect() is called ONCE per attack from engine.ts.
//   2. It looks up the attack by card ID first, then card name + attack name.
//   3. Each handler receives the DamageContext and mutates it in place.
//      The engine then reads the final context to deal damage, self-damage,
//      bench damage, status, energy discard, etc.
//   4. Adding a new set: implement handlers below and register them in
//      ATTACK_EFFECT_REGISTRY at the bottom.
//
// Handlers only fire for SPECIAL effects — attacks with no text and a fixed
// damage number need no handler; the engine handles them automatically.
// ---------------------------------------------------------------------------

export interface AttackEffectHandler {
    (
        match: TCGMatch,
        isPlayer: boolean,
        attackerInst: PokemonInstance,
        defenderInst: PokemonInstance,
        attack: CardAttack,
        ctx: DamageContext
    ): void;
}

// ---------------------------------------------------------------------------
// Reusable building blocks
// ---------------------------------------------------------------------------

function coinFlipParalyze(
    ctx: DamageContext,
    match: TCGMatch,
    defenderInst: PokemonInstance,
    isPlayer: boolean
) {
    const heads = flipCoin();
    ctx.coinResults.push(heads);
    if (heads) ctx.statusToApply = 'paralyzed';
    ctx.customLog.push(`Coin flip: ${heads ? 'heads — Defending Pokémon is Paralyzed!' : 'tails — no effect.'}`);
}

function coinFlipSleep(
    ctx: DamageContext,
    match: TCGMatch,
    isPlayer: boolean
) {
    const heads = flipCoin();
    ctx.coinResults.push(heads);
    if (heads) ctx.statusToApply = 'asleep';
    ctx.customLog.push(`Coin flip: ${heads ? 'heads — Defending Pokémon is Asleep!' : 'tails — no effect.'}`);
}

function coinFlipConfuse(
    ctx: DamageContext
) {
    const heads = flipCoin();
    ctx.coinResults.push(heads);
    if (heads) ctx.statusToApply = 'confused';
    ctx.customLog.push(`Coin flip: ${heads ? 'heads — Defending Pokémon is Confused!' : 'tails — no effect.'}`);
}

function countAttachedEnergy(inst: PokemonInstance, type?: string): number {
    if (!type) return inst.attachedEnergy.length;
    return inst.attachedEnergy.filter(e => e.name === `${type} Energy` || e.name === type).length;
}

// ---------------------------------------------------------------------------
// Base Set 1 attack handlers
// Keyed as  `${cardId}:${attackName}`  (preferred) or  `${cardName}:${attackName}`
// ---------------------------------------------------------------------------

const ATTACK_HANDLERS: Record<string, AttackEffectHandler> = {

    // ---- Abra ---------------------------------------------------------------

    'Abra:Psyshock': (match, isPlayer, atk, def, attack, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Paralyzed!' : 'tails.'}`);
    },

    // ---- Kadabra ------------------------------------------------------------

    'Kadabra:Psybeam': (match, isPlayer, atk, def, attack, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'confused';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Confused!' : 'tails.'}`);
    },

    'Kadabra:Super Psy': (_m, _ip, _a, _d, _atk, ctx) => {
        // 40 flat — no coin, no extra effect
    },

    // ---- Alakazam -----------------------------------------------------------

    'Alakazam:Confuse Ray': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'confused';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Confused!' : 'tails.'}`);
    },

    // ---- Electabuzz ---------------------------------------------------------

    'Electabuzz:Thunder Shock': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Paralyzed!' : 'tails.'}`);
    },

    'Electabuzz:Thunder Punch': (match, isPlayer, atk, def, attack, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            ctx.extraDamage = 10;
            ctx.customLog.push(`Coin: heads — +10 damage (40 total).`);
        } else {
            ctx.selfDamage = 10;
            ctx.customLog.push(`Coin: tails — Electabuzz takes 10 damage.`);
        }
    },

    // ---- Hitmonchan ---------------------------------------------------------

    // Jab and Special Punch are plain damage — no handler needed.

    // ---- Magikarp -----------------------------------------------------------

    'Magikarp:Splash': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 0;
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Splash! Nothing happened.`);
    },

    'Magikarp:Flail': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = atk.currentDamage;
        ctx.applyWeaknessResistance = true;
    },

    // ---- Gyarados -----------------------------------------------------------

    'Gyarados:Dragon Rage': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 50;
    },

    'Gyarados:Bubblebeam': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Paralyzed!' : 'tails.'}`);
    },

    // ---- Gastly -------------------------------------------------------------

    'Gastly:Lick': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Coin: ${heads ? 'heads — Paralyzed!' : 'tails.'}`);
    },

    'Gastly:Sleeping Gas': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            ctx.statusToApply = 'asleep';
            ctx.customLog.push(`Coin: heads — Defending Pokémon is Asleep.`);
        } else {
            ctx.customLog.push(`Coin: tails — no effect.`);
        }
        ctx.preventAllDamage = true;
    },

    // ---- Haunter ------------------------------------------------------------

    'Haunter:Hypnosis': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.statusToApply = 'asleep';
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Defending Pokémon is now Asleep.`);
    },

    'Haunter:Dream Eater': (match, isPlayer, atk, def, attack, ctx) => {
        if (def.status.volatile !== 'asleep') {
            ctx.preventAllDamage = true;
            ctx.customLog.push(`Dream Eater: Defender is not Asleep — no damage.`);
        }
    },

    // ---- Gengar -------------------------------------------------------------

    'Gengar:Confuse Ray': (_m, _ip, _a, _d, _atk, ctx) => {
        coinFlipConfuse(ctx);
        ctx.preventAllDamage = true;
    },

    'Gengar:Curse': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        const opponent = isPlayer ? match.ai : match.player;
        const allOpp = opponent.getAllInPlay();
        if (allOpp.length > 0) {
            const target = allOpp[Math.floor(Math.random() * allOpp.length)];
            target.currentDamage += 10;
            ctx.customLog.push(`Curse moved 1 damage counter to ${target.topCard.name}.`);
        }
    },

    // ---- Blastoise ----------------------------------------------------------

    'Blastoise:Hydro Pump': (match, isPlayer, atk, def, attack, ctx) => {
        const waterAttached = countAttachedEnergy(atk, 'Water');
        const bonus = Math.max(0, (waterAttached - 2)) * 10;
        ctx.baseDamage = 40 + bonus;
        ctx.customLog.push(`Hydro Pump: ${waterAttached} Water Energy → ${ctx.baseDamage} damage.`);
    },

    // ---- Charizard ----------------------------------------------------------

    'Charizard:Fire Spin': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.discardAttackerEnergy = 2;
        ctx.baseDamage = 100;
        ctx.customLog.push(`Fire Spin: Discarding 2 Energy from Charizard.`);
    },

    // ---- Venusaur -----------------------------------------------------------

    'Venusaur:Solarbeam': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 60;
    },

    // ---- Ninetales ----------------------------------------------------------

    'Ninetales:Lure': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Lure: This ability is handled by Ninetales' Pokémon Power.`);
    },

    // ---- Clefairy -----------------------------------------------------------

    'Clefairy:Metronome': (match, isPlayer, atk, def, attack, ctx) => {
        const opponent = isPlayer ? match.ai : match.player;
        const oppActive = opponent.active;
        ctx.preventAllDamage = true;
        if (!oppActive || !oppActive.topCard.attacks?.length) {
            ctx.customLog.push(`Metronome: Opponent has no attacks to copy.`);
            return;
        }
        const copied = oppActive.topCard.attacks[Math.floor(Math.random() * oppActive.topCard.attacks.length)];
        const raw = parseInt(copied.damage.replace(/[^0-9]/g, ''));
        ctx.baseDamage = isNaN(raw) ? 0 : raw;
        ctx.preventAllDamage = false;
        ctx.customLog.push(`Metronome copied ${copied.name} (${copied.damage}).`);
        resolveAttackEffect(match, isPlayer, atk, def, copied, ctx);
    },

    // ---- Chansey ------------------------------------------------------------

    'Chansey:Scrunch': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            atk.protectedThisTurn = true;
            ctx.customLog.push(`Scrunch: heads — Chansey is protected next turn.`);
        } else {
            ctx.customLog.push(`Scrunch: tails — no effect.`);
        }
    },

    'Chansey:Double-edge': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.selfDamage = 80;
        ctx.baseDamage = 80;
        ctx.customLog.push(`Double-edge: Chansey also takes 80 damage.`);
    },

    // ---- Clefable -----------------------------------------------------------

    'Clefable:Metronome': (match, isPlayer, atk, def, attack, ctx) => {
        ATTACK_HANDLERS['Clefairy:Metronome'](match, isPlayer, atk, def, attack, ctx);
    },

    // ---- Poliwrath ----------------------------------------------------------

    'Poliwrath:Water Gun': (match, isPlayer, atk, def, attack, ctx) => {
        const waterAttached = countAttachedEnergy(atk, 'Water');
        ctx.baseDamage = waterAttached >= 2 ? 30 : waterAttached >= 1 ? 20 : 10;
        ctx.customLog.push(`Water Gun: ${waterAttached} Water Energy → ${ctx.baseDamage} damage.`);
    },

    'Poliwrath:Whirlpool': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 40;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            ctx.discardAttackerEnergy = 1;
            ctx.customLog.push(`Whirlpool: heads — discard 1 Energy from defender.`);
        } else {
            ctx.customLog.push(`Whirlpool: tails.`);
        }
    },

    // ---- Machamp ------------------------------------------------------------

    'Machamp:Seismic Toss': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = def.topCard.hp ? parseInt(def.topCard.hp) - def.currentDamage : 0;
        ctx.applyWeaknessResistance = false;
        ctx.customLog.push(`Seismic Toss: ${ctx.baseDamage} damage (ignores W/R).`);
    },

    'Machamp:Submission': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 60;
        ctx.selfDamage = 20;
        ctx.customLog.push(`Submission: Machamp takes 20 recoil.`);
    },

    // ---- Raichu -------------------------------------------------------------

    'Raichu:Agility': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 30;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            atk.protectedThisTurn = true;
            ctx.customLog.push(`Agility: heads — Raichu is protected next turn.`);
        } else {
            ctx.customLog.push(`Agility: tails.`);
        }
    },

    'Raichu:Thunder': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 60;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (!heads) {
            ctx.selfDamage = 30;
            ctx.customLog.push(`Thunder: tails — Raichu takes 30 recoil.`);
        }
    },

    // ---- Zapdos -------------------------------------------------------------

    'Zapdos:Thunder': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 60;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (!heads) {
            ctx.selfDamage = 30;
            ctx.customLog.push(`Thunder: tails — Zapdos takes 30 recoil.`);
        }
    },

    'Zapdos:Thunderbolt': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 100;
        ctx.discardAttackerEnergy = atk.attachedEnergy.length;
        ctx.customLog.push(`Thunderbolt: Discarding all Energy from Zapdos.`);
    },

    // ---- Articuno -----------------------------------------------------------

    'Articuno:Ice Beam': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Ice Beam: ${heads ? 'Paralyzed!' : 'tails.'}`);
    },

    'Articuno:Blizzard': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 40;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) {
            const opponent = isPlayer ? match.ai : match.player;
            for (const b of opponent.bench) {
                if (b) ctx.benchDamage.push({ instanceUid: b.uid, amount: 10 });
            }
            ctx.customLog.push(`Blizzard: heads — 10 to each opponent bench Pokémon.`);
        }
    },

    // ---- Moltres ------------------------------------------------------------

    'Moltres:Wildfire': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        const player = isPlayer ? match.player : match.ai;
        const fireEnergy = player.hand.filter(c => c.name === 'Fire Energy');
        for (const e of fireEnergy) {
            const idx = player.hand.indexOf(e);
            if (idx !== -1) player.hand.splice(idx, 1);
            player.discard.push(e);
        }
        ctx.customLog.push(`Wildfire: Discarded ${fireEnergy.length} Fire Energy from hand.`);
    },

    'Moltres:Dive Bomb': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 80;
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (!heads) {
            ctx.preventAllDamage = true;
            ctx.customLog.push(`Dive Bomb: tails — attack misses!`);
        }
    },

    // ---- Dragonite ----------------------------------------------------------

    'Dragonite:Slam': (_m, _ip, _a, _d, _atk, ctx) => {
        const flips = flipCoins(2);
        ctx.coinResults.push(...flips);
        const heads = flips.filter(Boolean).length;
        ctx.baseDamage = heads * 40;
        ctx.customLog.push(`Slam: ${heads} heads — ${ctx.baseDamage} damage.`);
    },

    'Dragonite:Step In': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Step In: Dragonite may switch with a Benched Pokémon.`);
    },

    // ---- Mewtwo -------------------------------------------------------------

    'Mewtwo:Psyburn': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
    },

    'Mewtwo:Barrier': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        atk.protectedThisTurn = true;
        ctx.customLog.push(`Barrier: Mewtwo protected next turn.`);
    },

    // ---- Slowbro ------------------------------------------------------------

    'Slowbro:Psyshock': (_m, _ip, _a, _d, _atk, ctx) => {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Coin: ${heads ? 'Paralyzed!' : 'tails.'}`);
    },

    'Slowbro:Amnesia': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Amnesia: Choose an attack — Slowbro is immune to it next turn. (passive)`);
    },

    // ---- Wigglytuff (Jungle) ------------------------------------------------

    'Wigglytuff:Do the Wave': (match, isPlayer, atk, def, attack, ctx) => {
        const player = isPlayer ? match.player : match.ai;
        const benchCount = player.bench.filter(b => b !== null).length;
        ctx.baseDamage = benchCount * 10;
        ctx.customLog.push(`Do the Wave: ${benchCount} Benched Pokémon → ${ctx.baseDamage} damage.`);
    },

    // ---- Scyther (Jungle) ---------------------------------------------------

    'Scyther:Swords Dance': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Swords Dance: Next Slash does +20 damage. (not yet tracked as buff)`);
    },

    'Scyther:Slash': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
    },

    // ---- Magmar (Fossil) ----------------------------------------------------

    'Magmar:Smokescreen': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 10;
        ctx.customLog.push(`Smokescreen: Opponent must flip heads to use attacks next turn. (passive marker — not yet tracked)`);
    },

    'Magmar:Fire Punch': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
    },

    // ---- Hitmonlee (Fossil) -------------------------------------------------

    'Hitmonlee:Stretch Kick': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        const opponent = isPlayer ? match.ai : match.player;
        const targets = opponent.bench.filter(b => b !== null);
        if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            ctx.benchDamage.push({ instanceUid: target.uid, amount: 30 });
            ctx.customLog.push(`Stretch Kick: 30 damage to ${target.topCard.name} on bench.`);
        } else {
            ctx.customLog.push(`Stretch Kick: No Benched Pokémon to target.`);
        }
    },

    'Hitmonlee:High Jump Kick': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 50;
    },

    // ---- Fossil Pokémon -----------------------------------------------------

    'Aerodactyl:Wing Attack': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
    },

    'Kabutops:Slash': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 50;
    },

    'Omastar:Water Gun': (match, isPlayer, atk, def, attack, ctx) => {
        const waterAttached = countAttachedEnergy(atk, 'Water');
        ctx.baseDamage = 10 + (Math.max(0, waterAttached - 1)) * 10;
        ctx.customLog.push(`Water Gun: ${ctx.baseDamage} damage.`);
    },

    // ---- Self-destruct group ------------------------------------------------

    'Electrode:Buzzap': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        const player = isPlayer ? match.player : match.ai;
        player.discard.push(...atk.cards, ...atk.attachedEnergy);
        player.active = null;
        player.pendingPromotion = true;
        ctx.customLog.push(`Buzzap: Electrode is discarded. Attach 2 Lightning Energy to a Pokémon. (partial)`);
        match.addLog(`Electrode used Buzzap and was discarded!`);
    },

    'Weezing:Self-Destruct': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = 60;
        ctx.selfDamage = 9999;
        const player = isPlayer ? match.player : match.ai;
        for (const b of player.bench) {
            if (b) ctx.benchDamage.push({ instanceUid: b.uid, amount: 20 });
        }
        const opponent = isPlayer ? match.ai : match.player;
        for (const b of opponent.bench) {
            if (b) ctx.benchDamage.push({ instanceUid: b.uid, amount: 20 });
        }
        ctx.customLog.push(`Self-Destruct: 20 to all Benched Pokémon. Weezing KO'd.`);
    },

    'Gengar:Dark Mind': (_m, _ip, _a, _d, _atk, ctx) => {
        ctx.baseDamage = 30;
    },

};

// ---------------------------------------------------------------------------
// Public resolver — called by engine.ts
// ---------------------------------------------------------------------------

export function resolveAttackEffect(
    match: TCGMatch,
    isPlayer: boolean,
    attackerInst: PokemonInstance,
    defenderInst: PokemonInstance,
    attack: CardAttack,
    ctx: DamageContext
): void {
    const cardName = attackerInst.topCard.name;
    const cardId = attackerInst.topCard.id;
    const attackName = attack.name;

    const byId = cardId ? `${cardId}:${attackName}` : null;
    const byName = `${cardName}:${attackName}`;

    const handler = (byId ? ATTACK_HANDLERS[byId] : null) ?? ATTACK_HANDLERS[byName];

    if (handler) {
        handler(match, isPlayer, attackerInst, defenderInst, attack, ctx);
        return;
    }

    if (attack.text) {
        parseGenericAttackText(match, isPlayer, attackerInst, defenderInst, attack, ctx);
    }
}

// ---------------------------------------------------------------------------
// Generic text parser — catches common patterns for future/unknown cards
// so they degrade gracefully rather than silently doing nothing.
// ---------------------------------------------------------------------------

function parseGenericAttackText(
    match: TCGMatch,
    isPlayer: boolean,
    attackerInst: PokemonInstance,
    defenderInst: PokemonInstance,
    attack: CardAttack,
    ctx: DamageContext
): void {
    const text = attack.text.toLowerCase();

    if (text.includes('paralyzed')) {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'paralyzed';
        ctx.customLog.push(`Auto-parsed: ${heads ? 'Paralyzed!' : 'no effect.'}`);
    } else if (text.includes('asleep') || text.includes('sleep')) {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'asleep';
        ctx.customLog.push(`Auto-parsed: ${heads ? 'Asleep!' : 'no effect.'}`);
    } else if (text.includes('confused')) {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        if (heads) ctx.statusToApply = 'confused';
        ctx.customLog.push(`Auto-parsed: ${heads ? 'Confused!' : 'no effect.'}`);
    } else if (text.includes('poisoned')) {
        ctx.poisonToApply = true;
        ctx.customLog.push(`Auto-parsed: Poisoned.`);
    } else if (text.includes('burned')) {
        ctx.burnToApply = true;
        ctx.customLog.push(`Auto-parsed: Burned.`);
    } else if (text.includes('discard all energy')) {
        ctx.discardAttackerEnergy = attackerInst.attachedEnergy.length;
        ctx.customLog.push(`Auto-parsed: Discarded all Energy.`);
    } else if (text.includes('does nothing') || text.includes('no effect')) {
        ctx.preventAllDamage = true;
    }
}
