import type { TCGMatch, PokemonInstance, DamageContext } from './engine';
import { flipCoin, flipCoins, freshDamageContext } from './engine';
import type { CardAttack } from './engine';

// ---------------------------------------------------------------------------
// Attack Effect Resolver
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
// Base Set 1 specific attack handlers
// Complex attacks that the generic parser cannot safely handle go here.
// ---------------------------------------------------------------------------

const ATTACK_HANDLERS: Record<string, AttackEffectHandler> = {

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

    'Machamp:Seismic Toss': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.baseDamage = def.topCard.hp ? parseInt(def.topCard.hp) - def.currentDamage : 0;
        ctx.applyWeaknessResistance = false;
        ctx.customLog.push(`Seismic Toss: ${ctx.baseDamage} damage (ignores W/R).`);
    },

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

    'Dragonite:Step In': (match, isPlayer, atk, def, attack, ctx) => {
        ctx.preventAllDamage = true;
        ctx.customLog.push(`Step In: Dragonite may switch with a Benched Pokémon.`);
    },

    'Wigglytuff:Do the Wave': (match, isPlayer, atk, def, attack, ctx) => {
        const player = isPlayer ? match.player : match.ai;
        const benchCount = player.bench.filter(b => b !== null).length;
        ctx.baseDamage = benchCount * 10;
        ctx.customLog.push(`Do the Wave: ${benchCount} Benched Pokémon → ${ctx.baseDamage} damage.`);
    },

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
// Advanced Generic Text Parser
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

    // 1. Coin Flip Multipliers (e.g. 30x)
    if (attack.damage.includes('×') || attack.damage.includes('x')) {
        const base = parseInt(attack.damage.replace(/[^0-9]/g, '')) || 10;
        let flips = 1;
        if (text.includes('flip 2 coins')) flips = 2;
        else if (text.includes('flip 3 coins')) flips = 3;
        else if (text.includes('flip 4 coins')) flips = 4;
        
        const results = flipCoins(flips);
        ctx.coinResults.push(...results);
        const heads = results.filter(Boolean).length;
        ctx.baseDamage = base * heads;
        ctx.customLog.push(`Auto-parsed: Flipped ${flips} coins, ${heads} heads -> ${ctx.baseDamage} damage.`);
    }

    // 2. Damage Modifiers
    if (attack.damage.includes('-')) {
        if (text.includes('minus 10 damage for each damage counter')) {
            const base = parseInt(attack.damage.replace(/[^0-9]/g, '')) || 50;
            const counters = Math.floor(attackerInst.currentDamage / 10);
            ctx.baseDamage = Math.max(0, base - (counters * 10));
            ctx.customLog.push(`Auto-parsed: ${counters} damage counters -> ${ctx.baseDamage} damage.`);
        }
    } else if (attack.damage.includes('+')) {
         if (text.includes('10 more damage for each damage counter on the defending')) {
            const base = parseInt(attack.damage.replace(/[^0-9]/g, '')) || 10;
            const counters = Math.floor(defenderInst.currentDamage / 10);
            ctx.baseDamage = base + (counters * 10);
            ctx.customLog.push(`Auto-parsed: ${counters} counters on defender -> ${ctx.baseDamage} damage.`);
        } else if (text.includes('more damage for each water energy attached')) {
            const base = parseInt(attack.damage.replace(/[^0-9]/g, '')) || 10;
            const waterAttached = attackerInst.attachedEnergy.filter(e => e.name === 'Water Energy').length;
            const costWater = attack.cost.filter(c => c === 'Water').length;
            const extra = Math.min(2, Math.max(0, waterAttached - costWater));
            ctx.baseDamage = base + (extra * 10);
            ctx.customLog.push(`Auto-parsed: +${extra * 10} damage from extra Water Energy.`);
        }
    }

    // 3. Status Effects (including Toxic Severe Poison)
    let applyStatus = true;
    if (text.includes('flip a coin. if heads, the defending pokémon is now')) {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        applyStatus = heads;
        ctx.customLog.push(`Coin flip for status: ${heads ? 'Heads' : 'Tails'}.`);
    } else if (text.includes('flip a coin. if tails, the defending')) {
        const heads = flipCoin();
        ctx.coinResults.push(heads);
        applyStatus = !heads;
        ctx.customLog.push(`Coin flip for status: ${heads ? 'Heads' : 'Tails'}.`);
    }

    if (applyStatus) {
        if (text.includes('is now paralyzed')) ctx.statusToApply = 'paralyzed';
        else if (text.includes('is now asleep')) ctx.statusToApply = 'asleep';
        else if (text.includes('is now confused')) ctx.statusToApply = 'confused';
        else if (text.includes('is now poisoned')) {
            ctx.poisonToApply = true;
            if (text.includes('takes 20 poison damage')) ctx.toxicPoison = true; // Nidoking Toxic
        }
        else if (text.includes('is now burned')) ctx.burnToApply = true;
    }

    // 4. Healing
    if (text.includes('remove all damage counters from')) {
        attackerInst.currentDamage = 0;
        ctx.customLog.push(`Auto-parsed: Healed all damage from ${attackerInst.topCard.name}.`);
    } else if (text.includes('remove 1 damage counter from')) {
        attackerInst.currentDamage = Math.max(0, attackerInst.currentDamage - 10);
    } else if (text.includes('remove up to 2 damage counters')) {
        attackerInst.currentDamage = Math.max(0, attackerInst.currentDamage - 20);
    }

    // 5. Energy Discard
    if (text.includes('discard 1 water energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Water'); }
    else if (text.includes('discard 1 fire energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Fire'); }
    else if (text.includes('discard 1 psychic energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Psychic'); }
    else if (text.includes('discard 1 lightning energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Lightning'); }
    else if (text.includes('discard 1 grass energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Grass'); }
    else if (text.includes('discard 1 fighting energy')) { ctx.discardAttackerEnergy = 1; ctx.discardAttackerEnergyTypes.push('Fighting'); }
    else if (text.includes('discard 1 energy')) { ctx.discardAttackerEnergy = 1; }
    else if (text.includes('discard 2 energy')) { ctx.discardAttackerEnergy = 2; }
    else if (text.includes('discard all energy')) { ctx.discardAttackerEnergy = attackerInst.attachedEnergy.length; }

    // Opponent Energy Discard (Poliwrath Whirlpool / Dragonair Hyper Beam)
    if (text.includes('defending pokémon has any energy cards attached to it, choose 1 of them and discard it')) {
        ctx.discardDefenderEnergy = 1;
    }

    // 6. Recoil / Self Damage
    if (text.match(/does [0-9]+ damage to itself/)) {
        const amtStr = text.match(/does ([0-9]+) damage to itself/);
        const amt = amtStr ? parseInt(amtStr[1]) : 10;
        
        if (text.includes('if tails,')) {
            let tails = false;
            if (ctx.coinResults.length > 0) {
                tails = !ctx.coinResults[ctx.coinResults.length - 1];
            } else {
                const flip = flipCoin();
                ctx.coinResults.push(flip);
                tails = !flip;
                ctx.customLog.push(`Coin flip for recoil: ${flip ? 'Heads' : 'Tails'}.`);
            }
            if (tails) ctx.selfDamage = amt;
        } else {
            ctx.selfDamage = amt;
        }
    }

    // 7. Bench Damage
    if (text.includes('does 10 damage to each pokémon on each player\'s bench')) {
        const player = match.player;
        const ai = match.ai;
        [...player.bench, ...ai.bench].forEach(b => {
            if (b) ctx.benchDamage.push({ instanceUid: b.uid, amount: 10 });
        });
    } else if (text.includes('does 10 damage to each of your own benched')) {
        const owner = isPlayer ? match.player : match.ai;
        owner.bench.forEach(b => {
            if (b) ctx.benchDamage.push({ instanceUid: b.uid, amount: 10 });
        });
    }

    // 8. Protection (Agility / Withdraw / Barrier)
    if (text.includes('prevent all damage done to') || text.includes('prevent all effects of attacks')) {
        let protect = true;
        if (text.includes('flip a coin')) {
            if (ctx.coinResults.length === 0) {
                const heads = flipCoin();
                ctx.coinResults.push(heads);
                ctx.customLog.push(`Coin flip for protection: ${heads ? 'Heads' : 'Tails'}.`);
            }
            protect = ctx.coinResults[ctx.coinResults.length - 1];
        }
        if (protect) {
            attackerInst.protectedThisTurn = true; 
            ctx.customLog.push(`Auto-parsed: Protected from attacks next turn.`);
        }
    }
    
    // 9. Utility
    if (text.includes('does nothing') || text.includes('no effect')) {
        ctx.preventAllDamage = true;
    }

    // 10. Math Damage (Raticate's Super Fang)
    if (text.includes('half the defending pokémon\'s remaining hp')) {
        ctx.baseDamage = Math.ceil(defenderInst.currentHP / 20) * 10;
        ctx.customLog.push(`Auto-parsed: Halved defender's HP.`);
    }

    // 11. Forced Switching (Whirlwind, Roar)
    if (text.includes('switch it with his or her active pokémon') || text.includes('switches it with the defending pokémon')) {
        ctx.forceOpponentSwitch = true;
        ctx.customLog.push(`Auto-parsed: Opponent is forced to switch Active Pokémon.`);
    }

    // 12. Attack Copying (Metronome)
    if (text.includes('choose 1 of the defending pokémon\'s attacks') && text.includes('copies that attack')) {
         if (defenderInst.topCard.attacks && defenderInst.topCard.attacks.length > 0) {
             const copied = defenderInst.topCard.attacks[Math.floor(Math.random() * defenderInst.topCard.attacks.length)];
             const raw = parseInt(copied.damage.replace(/[^0-9]/g, '')) || 0;
             ctx.baseDamage = raw;
             ctx.customLog.push(`Auto-parsed: Copied ${copied.name} (${copied.damage}).`);
             // Recursively resolve copied text
             parseGenericAttackText(match, isPlayer, attackerInst, defenderInst, copied, ctx);
         } else {
             ctx.customLog.push(`Auto-parsed: No attacks to copy.`);
         }
    }

    // 13. Attack Disabling (Amnesia)
    if (text.includes('choose 1 of the defending pokémon\'s attacks') && text.includes('can\'t use that attack')) {
        ctx.disableOpponentAttack = true;
        ctx.customLog.push(`Auto-parsed: Triggering Amnesia UI selection.`);
    }

    // 14. Accuracy Debuff (Sand-attack)
    if (text.includes('if the defending pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. if tails, that attack does nothing')) {
        defenderInst.blindedThisTurn = true;
        ctx.customLog.push(`Auto-parsed: Opponent accuracy blinded for 1 turn.`);
    }

    // 15. Threshold Protection (Harden)
    if (text.includes('30 or less damage is done to') && text.includes('prevent that damage')) {
        attackerInst.damageThresholdProtection = 30;
        ctx.customLog.push(`Auto-parsed: Preventing incoming damage 30 or below.`);
    }

    // 16. Retaliation KO (Destiny Bond)
    if (text.includes('knocks out gastly during your opponent\'s next turn, knock out that pokémon')) {
        attackerInst.destinyBondActive = true;
        ctx.customLog.push(`Auto-parsed: Destiny Bond active.`);
    }

    // 17. One-Time Use Lock (Leek Slap)
    if (text.includes('can\'t use this attack again as long as')) {
        ctx.oneTimeUseAttack = attack.name;
    }

    // 18. Last Turn Memory (Mirror Move)
    if (text.includes('was attacked last turn, do the final result of that attack')) {
        ctx.baseDamage = attackerInst.damageTakenLastTurn;
        ctx.customLog.push(`Auto-parsed: Reflecting ${attackerInst.damageTakenLastTurn} damage from last turn.`);
    }

    // 19. Dynamic Type Changes (Conversion)
    if (text.includes('change it to a type of your choice')) {
        ctx.changeWeakness = true;
    }
    if (text.includes('change porygon\'s resistance to a type of your choice')) {
        ctx.changeResistance = true;
    }
}
