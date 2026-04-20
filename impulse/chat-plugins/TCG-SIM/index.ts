import { FS } from '../../../lib';
import {
    TCGMatch, TCGCard, InGameCard, PokemonInstance,
    isBasicPokemon, isEvolutionPokemon, isEnergyCard, isTrainerCard,
    hasEnoughEnergy, canRetreat, validateDeck,
} from './engine';
import { TrainerEffects } from './effects';

let baseSetData: TCGCard[] = [];
try {
    const rawData = FS('impulse/chat-plugins/TCG-SIM/base1.json').readIfExistsSync();
    if (rawData) {
        const parsed = JSON.parse(rawData);
        baseSetData = Array.isArray(parsed) ? parsed : (parsed.data || []);
    }
} catch (e) {
    console.error('Failed to load Base Set JSON:', e);
}

const activeMatches = new Map<string, TCGMatch>();

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

const STATUS_EMOJI: Record<string, string> = {
    poisoned: '☠',
    burned: '🔥',
    asleep: '💤',
    confused: '😵',
    paralyzed: '⚡',
};

const STATUS_COLOR: Record<string, string> = {
    poisoned: '#9b59b6',
    burned: '#e67e22',
    asleep: '#3498db',
    confused: '#f39c12',
    paralyzed: '#e5c100',
};

function getStatusBadge(inst: PokemonInstance): string {
    const badges: string[] = [];
    if (inst.status.volatile) {
        const s = inst.status.volatile;
        badges.push(`<span style="background:${STATUS_COLOR[s]};color:#fff;border-radius:3px;font-size:9px;padding:1px 3px;">${STATUS_EMOJI[s]}</span>`);
    }
    if (inst.status.poisoned) badges.push(`<span style="background:${STATUS_COLOR.poisoned};color:#fff;border-radius:3px;font-size:9px;padding:1px 3px;">${STATUS_EMOJI.poisoned}</span>`);
    if (inst.status.burned) badges.push(`<span style="background:${STATUS_COLOR.burned};color:#fff;border-radius:3px;font-size:9px;padding:1px 3px;">${STATUS_EMOJI.burned}</span>`);
    return badges.join('');
}

// ---------------------------------------------------------------------------
// Slot renderer
// ---------------------------------------------------------------------------

function renderSlot(
    instance: PokemonInstance | null,
    context: 'active' | 'bench',
    targetSlot: number | 'active',
    isAi: boolean,
    match: TCGMatch
): string {
    const player = match.player;
    const selectedCard = player.hand.find(c => c.uid === player.selectedUid);
    const trainerEffect = selectedCard && isTrainerCard(selectedCard)
        ? (TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name])
        : null;

    const pending = player.pendingEffect;
    const isSERPending = !isAi && pending?.filter?.startsWith('ser_target:') && pending.needed === 0;
    const isOpponentTargeted = !!trainerEffect?.requiresTarget && !!trainerEffect?.opponentTarget;
    const isOwnTargetedTrainer = !!trainerEffect?.requiresTarget && !trainerEffect?.opponentTarget;
    const isSelectedEnergy = !!selectedCard && isEnergyCard(selectedCard);
    const isSelectedEvolution = !!selectedCard && isEvolutionPokemon(selectedCard);
    const isSelectedBasic = !!selectedCard && isBasicPokemon(selectedCard);

    if (!instance) {
        let btnValue = '';
        if (!isAi && !match.winner) {
            if (isSelectedBasic) btnValue = `/tcg place ${targetSlot}`;
        }
        if (btnValue) {
            return `<button class="button" name="send" value="${btnValue}" style="width:75px;height:104px;margin:1px;background:#e6f2ff;border:2px dashed #007bff;border-radius:6px;cursor:pointer;color:#007bff;font-weight:bold;font-size:11px;">Place<br/>Here</button>`;
        }
        return `<div style="width:75px;height:104px;border:1px dashed #888;border-radius:6px;display:inline-block;vertical-align:top;margin:1px;text-align:center;line-height:104px;color:#888;font-size:10px;">Empty</div>`;
    }

    const card = instance.topCard;
    let btnValue = '';
    let overlayLabel = '';
    let overlayColor = '';

    if (!match.winner) {
        if (isAi) {
            if (isOpponentTargeted && !player.pendingEffect) {
                btnValue = `/tcg playtrainer ${selectedCard!.uid} ${targetSlot}`;
                overlayLabel = 'Target';
                overlayColor = 'rgba(220,53,69,0.4)';
            }
        } else {
            if (isSERPending && instance.attachedEnergy.length > 0) {
                overlayLabel = 'Pick Energy';
                overlayColor = 'rgba(220,53,69,0.3)';
            } else if (pending?.trainerName === 'Pokémon Breeder' && pending.selected.length >= pending.needed) {
                if (instance.stage === 0) {
                    btnValue = `/tcg breederplace ${targetSlot}`;
                    overlayLabel = 'Breed Here';
                    overlayColor = 'rgba(255,140,0,0.45)';
                }
            } else if (isSelectedEnergy) {
                btnValue = `/tcg attach ${targetSlot}`;
                overlayLabel = 'Attach';
                overlayColor = 'rgba(0,123,255,0.3)';
            } else if (isSelectedEvolution && selectedCard!.evolvesFrom === card.name) {
                btnValue = `/tcg evolve ${targetSlot}`;
                overlayLabel = 'Evolve';
                overlayColor = 'rgba(255,193,7,0.4)';
            } else if (isOwnTargetedTrainer) {
                btnValue = `/tcg playtrainer ${selectedCard!.uid} ${targetSlot}`;
                overlayLabel = 'Target';
                overlayColor = 'rgba(153,50,204,0.4)';
            } else if (!selectedCard && context === 'bench' && !player.active) {
                btnValue = `/tcg promote ${targetSlot}`;
                overlayLabel = 'Promote';
                overlayColor = 'rgba(40,167,69,0.3)';
            } else if (!selectedCard && context === 'active') {
                const isSelectedField = instance.uid === player.selectedUid;
                btnValue = isSelectedField ? `/tcg deselect` : `/tcg select ${instance.uid}`;
            }
        }
    }

    const isSelectedField = !isAi && instance.uid === player.selectedUid;
    const borderStyle = isSelectedField ? '2px solid #007bff' : '2px solid transparent';

    let html = `<div style="width:75px;display:inline-block;vertical-align:top;margin:1px;text-align:center;border:${borderStyle};border-radius:6px;position:relative;">`;

    if (btnValue) {
        html += `<button class="button" name="send" value="${btnValue}" style="background:transparent;border:none;padding:0;margin:0;width:100%;cursor:pointer;display:block;box-shadow:none;">`;
    }
    html += `<img src="${card.images.small}" style="width:100%;border-radius:4px;display:block;" alt="${card.name}" />`;
    if (btnValue && overlayLabel) {
        html += `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:${overlayColor};border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;text-shadow:1px 1px 2px black;">${overlayLabel}</div>`;
    }
    if (btnValue) html += `</button>`;

    if (instance.currentDamage > 0) {
        html += `<div style="position:absolute;top:-2px;right:-2px;background:#e60000;color:#fff;font-weight:bold;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid #fff;pointer-events:none;">-${instance.currentDamage}</div>`;
    }
    if (instance.attachedEnergy.length > 0) {
        html += `<div style="position:absolute;bottom:-2px;right:-2px;background:#222;color:#fff;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid #fff;pointer-events:none;">⚡${instance.attachedEnergy.length}</div>`;
    }
    if (instance.attachedItems.length > 0) {
        const itemLabels = instance.attachedItems.map(i =>
            i.card.name === 'PlusPower' ? '➕' : i.card.name === 'Defender' ? '🛡' : '📎'
        ).join('');
        html += `<div style="position:absolute;bottom:-2px;left:-2px;background:#555;color:#fff;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid #fff;pointer-events:none;">${itemLabels}</div>`;
    }

    const statusBadge = getStatusBadge(instance);
    if (statusBadge) {
        html += `<div style="position:absolute;top:-2px;left:-2px;pointer-events:none;">${statusBadge}</div>`;
    }

    if (instance.topCard.abilities?.length) {
        const hasPower = instance.topCard.abilities.some(a => a.type === 'Pokémon Power' || a.type === 'Poké-Power');
        if (hasPower && !isAi) {
            html += `<div style="position:absolute;top:50%;left:0;width:100%;transform:translateY(-50%);pointer-events:none;text-align:center;"><span style="background:rgba(83,74,183,0.8);color:#fff;border-radius:3px;font-size:9px;padding:1px 4px;">POWER</span></div>`;
        }
    }

    html += `</div>`;
    return html;
}

// ---------------------------------------------------------------------------
// Hand card renderer
// ---------------------------------------------------------------------------

function renderHandCard(card: InGameCard, match: TCGMatch): string {
    const isSelected = card.uid === match.player.selectedUid;
    const pending = match.player.pendingEffect;
    const isPendingSelected = pending && pending.selected.includes(card.uid);
    const isPendingCandidate = pending && !pending.selected.includes(card.uid) && card.uid !== pending.trainerUid;

    let border = isSelected ? '2px solid #007bff' : '2px solid transparent';
    if (isPendingSelected) border = '2px solid #e67e00';
    if (isPendingCandidate) border = '1px dashed #e67e00';

    let btnValue = '';
    if (!match.winner) {
        if (pending) {
            if (card.uid !== pending.trainerUid) {
                btnValue = isPendingSelected
                    ? `/tcg pendingdeselect ${card.uid}`
                    : `/tcg pendingselect ${card.uid}`;
            }
        } else {
            btnValue = isSelected ? `/tcg deselect` : `/tcg select ${card.uid}`;
        }
    }

    let html = `<div style="width:75px;display:inline-block;vertical-align:top;margin:1px;text-align:center;border:${border};border-radius:6px;position:relative;">`;
    if (btnValue) html += `<button class="button" name="send" value="${btnValue}" style="background:transparent;border:none;padding:0;margin:0;width:100%;cursor:pointer;display:block;box-shadow:none;">`;
    html += `<img src="${card.images.small}" style="width:100%;border-radius:4px;display:block;" alt="${card.name}" />`;
    if (btnValue) html += `</button>`;
    if (isPendingSelected) {
        html += `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(230,126,0,0.35);border-radius:4px;pointer-events:none;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;text-shadow:1px 1px 2px black;">✓</div>`;
    }
    html += `</div>`;
    return html;
}

function renderDiscardCard(card: InGameCard, index: number, cmdPrefix: string): string {
    return `<button class="button" name="send" value="${cmdPrefix} ${index}" style="background:transparent;border:1px solid #666;padding:0;margin:1px;width:55px;cursor:pointer;border-radius:4px;vertical-align:top;display:inline-block;">` +
        `<img src="${card.images.small}" style="width:100%;border-radius:3px;display:block;" alt="${card.name}" /></button>`;
}

// ---------------------------------------------------------------------------
// Pokédex UI
// ---------------------------------------------------------------------------

function renderPokedexUI(match: TCGMatch): string {
    const top5 = match.player.deck.slice(0, 5);
    let html = `<div style="background:#1a1a2e;padding:8px;border-radius:6px;margin-bottom:5px;">`;
    html += `<strong style="color:#fff;display:block;margin-bottom:4px;">🔍 Pokédex — Click to cycle card to bottom of preview</strong>`;
    html += `<div style="overflow-x:auto;white-space:nowrap;">`;
    for (let i = 0; i < top5.length; i++) {
        const c = top5[i];
        html += `<button class="button" name="send" value="/tcg pokedexmove ${i}" style="background:transparent;border:1px solid #aaa;padding:0;margin:1px;width:55px;cursor:pointer;border-radius:4px;vertical-align:top;display:inline-block;">` +
            `<img src="${c.images.small}" style="width:100%;border-radius:3px;display:block;" alt="${c.name}"/></button>`;
    }
    html += `</div>`;
    html += `<div style="margin-top:4px;text-align:right;">`;
    html += `<button class="button" name="send" value="/tcg pokedexconfirm" style="font-weight:bold;background:#28a745;color:white;margin-right:4px;">Confirm Order</button>`;
    html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;">Cancel</button>`;
    html += `</div></div>`;
    return html;
}

// ---------------------------------------------------------------------------
// Pending effect UI
// ---------------------------------------------------------------------------

function renderPendingUI(match: TCGMatch): string {
    const pending = match.player.pendingEffect!;
    let html = `<div style="background:#fff3cd;border:1px solid #ffc107;padding:8px;border-radius:6px;margin-bottom:5px;">`;
    html += `<strong>🃏 ${pending.trainerName}</strong> — `;

    if (pending.type === 'discard_for_effect') {
        if (pending.filter?.startsWith('superpotion_target:')) {
            const slotStr = pending.filter.replace('superpotion_target:', '');
            const slot: 'active' | number = slotStr === 'active' ? 'active' : parseInt(slotStr);
            const inst = slot === 'active' ? match.player.active : match.player.bench[slot as number];
            if (!inst) { html += `Target not found.`; } else {
                html += `Pick 1 Energy to discard from <strong>${inst.topCard.name}</strong>:</div>`;
                html += `<div style="background:#fff3cd;border:1px solid #ffc107;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                for (let i = 0; i < inst.attachedEnergy.length; i++) {
                    const e = inst.attachedEnergy[i];
                    html += `<button class="button" name="send" value="/tcg superpotionpick ${i}" style="background:transparent;border:1px solid #e67e00;padding:2px 4px;margin:2px;border-radius:4px;cursor:pointer;">` +
                        `<img src="${e.images.small}" style="width:40px;display:block;" alt="${e.name}"/><span style="font-size:9px;">${e.name}</span></button>`;
                }
                html += `</div><button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;">Cancel</button>`;
            }
            return html;
        }

        if (pending.filter?.startsWith('ser_target:')) {
            html += `Pick 1 Energy from your own Pokémon to discard:</div>`;
            html += `<div style="background:#ffe0e0;border:1px solid #dc3545;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
            for (const inst of match.player.getAllInPlay()) {
                for (let i = 0; i < inst.attachedEnergy.length; i++) {
                    const e = inst.attachedEnergy[i];
                    html += `<button class="button" name="send" value="/tcg serownpick ${inst.uid} ${i}" style="background:transparent;border:1px solid #dc3545;padding:2px 4px;margin:2px;border-radius:4px;cursor:pointer;font-size:11px;">` +
                        `<img src="${e.images.small}" style="width:40px;display:block;" alt="${e.name}"/><span style="font-size:9px;">${inst.topCard.name}</span></button>`;
                }
            }
            html += `</div><button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;">Cancel</button>`;
            return html;
        }

        const remaining = pending.needed - pending.selected.length;
        if (remaining > 0) {
            if (pending.filter === 'stage2_hand') {
                html += `Select a Stage 2 from your hand, then click its Basic on the field.`;
            } else {
                html += `Select ${remaining} more card${remaining !== 1 ? 's' : ''} from your hand.`;
            }
            if (pending.selected.length > 0) {
                html += ` <button class="button" name="send" value="/tcg pendingclearsel" style="font-size:10px;margin-left:4px;">Clear</button>`;
            }
        } else {
            if (pending.trainerName === 'Computer Search') {
                html += `Pick any card from your deck:</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                for (let i = 0; i < match.player.deck.length; i++) {
                    html += renderDiscardCard(match.player.deck[i], i, '/tcg pendingfinish deck');
                }
            } else if (pending.trainerName === 'Item Finder') {
                const trainers = match.player.discard.map((c, i) => ({ c, i })).filter(({ c }) => isTrainerCard(c));
                if (!trainers.length) { html += `No Trainers in discard. <button class="button" name="send" value="/tcg pendingcancel">Cancel</button>`; }
                else {
                    html += `Pick a Trainer from your discard:</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                    for (const { c, i } of trainers) html += renderDiscardCard(c, i, '/tcg pendingfinish discard');
                }
            } else if (pending.trainerName === 'Energy Retrieval') {
                const basics = match.player.discard.map((c, i) => ({ c, i })).filter(({ c }) => isEnergyCard(c) && c.subtypes?.includes('Basic'));
                if (!basics.length) { html += `No basic Energy in discard. <button class="button" name="send" value="/tcg pendingcancel">Cancel</button>`; }
                else {
                    html += `Pick up to 2 basic Energies:</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                    for (const { c, i } of basics) html += renderDiscardCard(c, i, '/tcg pendingfinish discard');
                }
            } else if (pending.trainerName === 'Pokémon Trader') {
                html += `Pick a Pokémon from your deck:</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                const pokes = match.player.deck.map((c, i) => ({ c, i })).filter(({ c }) => isBasicPokemon(c) || isEvolutionPokemon(c));
                for (const { c, i } of pokes) html += renderDiscardCard(c, i, '/tcg pendingfinish deck');
            } else if (pending.trainerName === 'Maintenance') {
                html += `<button class="button" name="send" value="/tcg pendingfinish confirm 0" style="font-weight:bold;">Confirm & Draw 1</button>`;
            }
        }
    } else if (pending.type === 'pick_from_discard') {
        html += `Pick from your discard:`;
    }

    html += `</div>`;
    if (pending.type === 'discard_for_effect' && pending.selected.length < pending.needed) {
        html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;">Cancel ${pending.trainerName}</button>`;
    }
    return html;
}

function renderOpponentDiscardPicker(match: TCGMatch): string {
    const cards = match.ai.discard.map((c, i) => ({ c, i })).filter(({ c }) => isBasicPokemon(c));
    if (!cards.length) return `<em style="color:#888;">Opponent's discard is empty.</em>`;
    let html = `<div style="overflow-x:auto;white-space:nowrap;">`;
    for (const { c, i } of cards) html += renderDiscardCard(c, i, '/tcg playtargetdiscard');
    html += `</div>`;
    return html;
}

// ---------------------------------------------------------------------------
// Promotion-required banner
// ---------------------------------------------------------------------------

function renderPromotionRequired(match: TCGMatch): string {
    const benchPokemon = match.player.bench
        .map((b, i) => ({ b, i }))
        .filter(({ b }) => b !== null);
    if (!benchPokemon.length) {
        return `<div style="background:#ffe6e6;border:2px solid red;padding:8px;border-radius:6px;margin-bottom:5px;text-align:center;">` +
            `<strong>Your Active Pokémon was KO'd and you have no Bench Pokémon!</strong></div>`;
    }
    let html = `<div style="background:#fff3cd;border:2px solid #ffc107;padding:8px;border-radius:6px;margin-bottom:5px;">`;
    html += `<strong>Your Active Pokémon was KO'd — choose a replacement:</strong><br/>`;
    for (const { b, i } of benchPokemon) {
        html += `<button class="button" name="send" value="/tcg promote ${i}" style="margin:4px;font-weight:bold;background:#c1e1c1;border:1px solid #28a745;">Send out ${b!.topCard.name}</button>`;
    }
    html += `</div>`;
    return html;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

export const commands: Chat.ChatCommands = {
    tcg: {
        start(target, room, user) {
            if (!baseSetData.length) return this.errorReply('TCG data not loaded.');
            if (activeMatches.has(user.id)) return this.errorReply('You already have a match. Use /join view-tcg-match');
            activeMatches.set(user.id, new TCGMatch(user.id, baseSetData));
            this.parse('/join view-tcg-match');
        },

        select(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingEffect) return this.errorReply('Complete or cancel the current effect first.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            const uid = parseInt(target);
            match.player.selectedUid = isNaN(uid) ? null : uid;
            this.refreshPage('tcg-match');
        },

        deselect(target, room, user) {
            const match = activeMatches.get(user.id);
            if (match) match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        place(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.selectedUid === null) return this.errorReply('No card selected.');
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.playBasicPokemon(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot place card there.');
            }
        },

        evolve(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.selectedUid === null) return this.errorReply('No card selected.');
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.evolvePokemon(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot evolve there.');
            }
        },

        attach(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.selectedUid === null) return this.errorReply('No card selected.');
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.attachEnergy(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot attach Energy — already attached this turn or invalid target.');
            }
        },

        playtrainer(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            const args = target.split(' ');
            const uid = parseInt(args[0]);
            const slot = args[1] === 'active' ? 'active' : args[1] !== undefined ? parseInt(args[1]) : undefined;
            if (isNaN(uid)) return this.errorReply('Invalid card.');
            if (match.playTrainer(true, uid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                if (match.player.pendingEffect) {
                    this.refreshPage('tcg-match');
                } else {
                    this.errorReply('Cannot use that Trainer right now.');
                }
            }
        },

        playtargetdiscard(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply('Invalid index.');
            const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
            if (!selectedCard) return this.errorReply('No card selected.');
            if (match.playTrainer(true, selectedCard.uid, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot use Trainer on that target.');
            }
        },

        promote(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply('Invalid bench index.');
            if (match.promote(true, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Could not promote that Pokémon.');
            }
        },

        retreat(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingEffect) return this.errorReply('Complete or cancel the current effect first.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            if (match.hasAttackedThisTurn) return this.errorReply('Cannot retreat after attacking.');
            const benchIndex = parseInt(target);
            if (isNaN(benchIndex)) return this.errorReply('Invalid bench index.');
            if (match.retreat(true, benchIndex)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot retreat right now.');
            }
        },

        attack(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply('Invalid attack index.');
            if (match.attack(true, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot attack — check Energy and status conditions.');
            }
        },

        usepower(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            const args = target.split(' ');
            const uid = parseInt(args[0]);
            const powerIndex = args[1] ? parseInt(args[1]) : 0;
            if (isNaN(uid)) return this.errorReply('Invalid UID.');
            if (match.usePokemonPower(true, uid, powerIndex)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot use that Pokémon Power right now.');
            }
        },

        endturn(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply('Not your turn.');
            if (match.player.pendingEffect) return this.errorReply('Complete or cancel the current effect first.');
            if (match.player.pendingPromotion) return this.errorReply('You must promote a Pokémon first.');
            match.endPlayerTurn();
            this.refreshPage('tcg-match');
        },

        // ---- Pending effect commands ----------------------------------------

        pendingselect(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const uid = parseInt(target);
            const pending = match.player.pendingEffect;
            if (pending.selected.length >= pending.needed) return this.errorReply('Already selected enough.');
            const card = match.player.hand.find(c => c.uid === uid);
            if (!card || uid === pending.trainerUid) return this.errorReply('Invalid selection.');
            if (pending.filter === 'stage2_hand' && !card.subtypes?.includes('Stage 2')) return this.errorReply('Must select a Stage 2.');
            if (pending.filter === 'pokemon_hand' && !isBasicPokemon(card) && !isEvolutionPokemon(card)) return this.errorReply('Must select a Pokémon.');
            if (!pending.selected.includes(uid)) pending.selected.push(uid);
            this.refreshPage('tcg-match');
        },

        pendingdeselect(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const uid = parseInt(target);
            match.player.pendingEffect.selected = match.player.pendingEffect.selected.filter(id => id !== uid);
            this.refreshPage('tcg-match');
        },

        pendingclearsel(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            match.player.pendingEffect.selected = [];
            this.refreshPage('tcg-match');
        },

        pendingcancel(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        pendingfinish(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const [source, idxStr] = target.split(' ');
            const idx = parseInt(idxStr);
            const pending = match.player.pendingEffect;
            const player = match.player;

            if (pending.selected.length < pending.needed) {
                return this.errorReply(`Still need ${pending.needed - pending.selected.length} more card(s).`);
            }

            const toProcess = pending.selected
                .map(uid => player.hand.find(c => c.uid === uid))
                .filter(Boolean) as InGameCard[];

            if (pending.trainerName === 'Maintenance' || pending.trainerName === 'Pokémon Trader') {
                for (const c of toProcess) {
                    player.hand.splice(player.hand.indexOf(c), 1);
                    player.deck.push(c);
                }
                for (let i = player.deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
                }
            } else {
                for (const c of toProcess) {
                    player.hand.splice(player.hand.indexOf(c), 1);
                    player.discard.push(c);
                }
            }

            if (source === 'deck' && !isNaN(idx)) {
                const picked = player.deck.splice(idx, 1)[0];
                if (picked) { player.hand.push(picked); match.addLog(`${pending.trainerName}: Picked ${picked.name}.`); }
            } else if (source === 'discard' && !isNaN(idx)) {
                if (pending.trainerName === 'Energy Retrieval') {
                    const picked = player.discard[idx];
                    if (picked) {
                        player.discard.splice(idx, 1);
                        player.hand.push(picked);
                        match.addLog(`Energy Retrieval: Retrieved ${picked.name}.`);
                        if (!pending.filter?.startsWith('energy_retrieval_done')) {
                            pending.filter = 'energy_retrieval_done';
                            this.refreshPage('tcg-match');
                            return;
                        }
                    }
                } else {
                    const picked = player.discard[idx];
                    if (picked) {
                        player.discard.splice(idx, 1);
                        player.hand.push(picked);
                        match.addLog(`${pending.trainerName}: Retrieved ${picked.name}.`);
                    }
                }
            } else if (source === 'confirm' && pending.trainerName === 'Maintenance') {
                player.draw(1);
                match.addLog(`Maintenance: Drew 1 card.`);
            }

            const tIdx = player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (tIdx !== -1) player.discard.push(player.hand.splice(tIdx, 1)[0]);
            player.pendingEffect = null;
            player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        superpotionpick(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const pending = match.player.pendingEffect;
            const eIdx = parseInt(target);
            if (isNaN(eIdx)) return this.errorReply('Invalid index.');
            const slotStr = pending.filter!.replace('superpotion_target:', '');
            const slot: 'active' | number = slotStr === 'active' ? 'active' : parseInt(slotStr);
            const inst = slot === 'active' ? match.player.active : match.player.bench[slot as number];
            if (!inst || eIdx >= inst.attachedEnergy.length) return this.errorReply('Invalid target.');
            const discarded = inst.attachedEnergy.splice(eIdx, 1)[0];
            match.player.discard.push(discarded);
            inst.currentDamage = Math.max(0, inst.currentDamage - 40);
            match.addLog(`Super Potion on ${inst.topCard.name}: -40 damage.`);
            const tIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (tIdx !== -1) match.player.discard.push(match.player.hand.splice(tIdx, 1)[0]);
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        serownpick(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const pending = match.player.pendingEffect;
            const [instUidStr, eIdxStr] = target.split(' ');
            const instUid = parseInt(instUidStr);
            const eIdx = parseInt(eIdxStr);
            if (isNaN(instUid) || isNaN(eIdx)) return this.errorReply('Invalid selection.');
            const inst = match.player.findInPlay(instUid);
            if (!inst || eIdx >= inst.attachedEnergy.length) return this.errorReply('Invalid target.');
            const selfDiscarded = inst.attachedEnergy.splice(eIdx, 1)[0];
            match.player.discard.push(selfDiscarded);
            const targetSlotStr = pending.filter!.replace('ser_target:', '');
            const targetSlot: 'active' | number = targetSlotStr === 'active' ? 'active' : parseInt(targetSlotStr);
            const oppTarget = targetSlot === 'active' ? match.ai.active : match.ai.bench[targetSlot as number];
            if (oppTarget) {
                const removed: string[] = [];
                for (let i = 0; i < 2 && oppTarget.attachedEnergy.length > 0; i++) {
                    const r = oppTarget.attachedEnergy.pop()!;
                    match.ai.discard.push(r);
                    removed.push(r.name);
                }
                match.addLog(`Super Energy Removal: removed ${removed.join(', ')} from ${oppTarget.topCard.name}.`);
            }
            const tIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (tIdx !== -1) match.player.discard.push(match.player.hand.splice(tIdx, 1)[0]);
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        pokedexmove(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.player.pendingEffect?.trainerName !== 'Pokédex') return this.errorReply('No Pokédex effect.');
            const idx = parseInt(target);
            if (isNaN(idx) || idx < 0 || idx >= 5) return this.errorReply('Invalid index.');
            const top5 = match.player.deck.splice(0, 5);
            const moved = top5.splice(idx, 1)[0];
            top5.push(moved);
            match.player.deck.unshift(...top5);
            this.refreshPage('tcg-match');
        },

        pokedexconfirm(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply('No active effect.');
            const pending = match.player.pendingEffect;
            const tIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (tIdx !== -1) match.player.discard.push(match.player.hand.splice(tIdx, 1)[0]);
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            match.addLog('Pokédex: Deck top rearranged.');
            this.refreshPage('tcg-match');
        },

        breederplace(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.player.pendingEffect?.trainerName !== 'Pokémon Breeder') return this.errorReply('No Breeder effect.');
            const pending = match.player.pendingEffect;
            if (pending.selected.length < pending.needed) return this.errorReply('Select a Stage 2 first.');
            const stage2Uid = pending.selected[0];
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.evolvePokemon(true, stage2Uid, slot, true)) {
                const tIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
                if (tIdx !== -1) match.player.discard.push(match.player.hand.splice(tIdx, 1)[0]);
                match.player.pendingEffect = null;
                match.player.selectedUid = null;
                match.addLog('Player played Pokémon Breeder!');
                this.refreshPage('tcg-match');
            } else {
                this.errorReply('Cannot place Stage 2 there — check chain and that Basic was in play before this turn.');
            }
        },

        quit(target, room, user) {
            if (activeMatches.has(user.id)) {
                activeMatches.delete(user.id);
                this.sendReply('You have exited the TCG match.');
                this.closePage('tcg-match');
            }
        },
    }
};

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

export const pages: Chat.PageTable = {
    tcg: {
        match(query, user, connection) {
            this.title = '[TCG] Match';
            const match = activeMatches.get(user.id);

            if (!match) {
                return this.setHTML(`<div class="pad"><h2>Pokémon TCG Simulator</h2><p>No active match.</p><button class="button" name="send" value="/tcg start">Start Match vs AI</button></div>`);
            }

            let html = `<div class="pad" style="max-width:900px;margin:auto;font-size:13px;">`;

            if (match.winner) {
                const win = match.winner === 'player';
                html += `<div style="background:${win ? '#e6ffe6' : '#ffe6e6'};border:2px solid ${win ? 'green' : 'red'};padding:10px;border-radius:6px;margin-bottom:10px;text-align:center;">`;
                html += `<h2 style="color:${win ? 'green' : 'red'};margin:0;">${win ? '🎉 YOU WIN! 🎉' : '💀 YOU LOSE! 💀'}</h2>`;
                html += `</div>`;
            }

            const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
            const trainerEffect = selectedCard && isTrainerCard(selectedCard)
                ? (TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name])
                : null;
            const isOppTargeted = !!trainerEffect?.requiresTarget && !!trainerEffect?.opponentTarget;

            html += `<div style="background:${isOppTargeted ? '#ffe8e8' : '#e8e8e8'};padding:5px;border-radius:6px;margin-bottom:5px;">`;
            html += `<strong>AI</strong> (Hand: ${match.ai.hand.length} | Deck: ${match.ai.deck.length} | Prizes: ${match.ai.prizes.length} | Discard: ${match.ai.discard.length})`;
            if (isOppTargeted) html += ` <span style="color:red;font-weight:bold;">← Click a target</span>`;
            html += `<div style="display:flex;gap:5px;margin-top:3px;">`;
            html += `<div><strong>Active:</strong><br/>${renderSlot(match.ai.active, 'active', 'active', true, match)}</div>`;
            html += `<div style="flex-grow:1;overflow-x:auto;white-space:nowrap;"><strong>Bench:</strong><br/>`;
            for (let i = 0; i < 5; i++) html += renderSlot(match.ai.bench[i], 'bench', i, true, match);
            html += `</div></div>`;

            if (isOppTargeted && selectedCard?.name === 'Pokémon Flute') {
                html += `<div style="margin-top:4px;"><strong style="font-size:11px;">Opponent's Discard (pick a Basic):</strong><br/>`;
                html += renderOpponentDiscardPicker(match);
                html += `</div>`;
            }
            html += `</div>`;

            html += `<hr style="margin:5px 0;"/>`;

            html += `<div style="background:#f0f8ff;padding:5px;border-radius:6px;margin-bottom:5px;">`;
            html += `<strong>Your Field</strong> (Deck: ${match.player.deck.length} | Prizes: ${match.player.prizes.length} | Discard: ${match.player.discard.length})`;
            html += `<div style="display:flex;gap:5px;margin-top:3px;">`;
            html += `<div><strong>Active:</strong><br/>${renderSlot(match.player.active, 'active', 'active', false, match)}</div>`;
            html += `<div style="flex-grow:1;overflow-x:auto;white-space:nowrap;"><strong>Bench:</strong><br/>`;
            for (let i = 0; i < 5; i++) html += renderSlot(match.player.bench[i], 'bench', i, false, match);
            html += `</div></div></div>`;

            const pending = match.player.pendingEffect;
            if (pending) {
                if (pending.filter === 'pokedex') {
                    html += renderPokedexUI(match);
                } else {
                    html += renderPendingUI(match);
                }
            }

            if (match.player.pendingPromotion && match.turn === 'player' && !match.winner) {
                html += renderPromotionRequired(match);
            }

            html += `<strong>Your Hand</strong>`;
            html += `<div style="overflow-x:auto;white-space:nowrap;padding-bottom:5px;">`;
            for (const card of match.player.hand) html += renderHandCard(card, match);
            html += `</div>`;

            html += `<div style="padding:5px;background:#fff;border-top:1px solid #ccc;">`;

            if (match.winner) {
                html += `<div style="text-align:center;"><button class="button" name="send" value="/tcg quit" style="font-weight:bold;padding:5px 15px;">Close Match</button></div>`;

            } else if (match.turn === 'player') {

                if (match.player.pendingPromotion) {
                    html += `<em style="color:#888;">Choose your next Active Pokémon above.</em>`;

                } else if (pending) {
                    html += `<em style="color:#888;">Complete the card effect above to continue.</em>`;

                } else if (match.player.active && match.player.selectedUid === match.player.active.uid) {
                    html += `<strong style="display:block;margin-bottom:5px;">Select an Attack:</strong>`;
                    match.player.active.topCard.attacks?.forEach((atk, i) => {
                        const canAtk = hasEnoughEnergy(match.player.active!, i);
                        const costStr = atk.cost?.join(', ') || 'Free';
                        if (canAtk) {
                            html += `<button class="button" name="send" value="/tcg attack ${i}" style="font-weight:bold;background:#ffe6e6;border:1px solid red;margin-right:5px;padding:5px;">⚔️ ${atk.name}${atk.damage ? ` (${atk.damage})` : ''}<br/><span style="font-size:9px;">${costStr}</span></button>`;
                        } else {
                            html += `<button class="button disabled" style="color:#888;margin-right:5px;cursor:not-allowed;padding:5px;" disabled>⚔️ ${atk.name}<br/><span style="font-size:9px;">Needs Energy</span></button>`;
                        }
                    });

                    const powers = match.player.active.topCard.abilities?.filter(a => a.type === 'Pokémon Power' || a.type === 'Poké-Power') ?? [];
                    for (let pi = 0; pi < powers.length; pi++) {
                        const pw = powers[pi];
                        const blocked = match.player.active.isPowerBlocked();
                        if (!blocked) {
                            html += `<button class="button" name="send" value="/tcg usepower ${match.player.active.uid} ${pi}" style="font-weight:bold;background:#f3e6ff;border:1px solid #9932CC;margin-right:5px;padding:5px;">✨ ${pw.name}</button>`;
                        } else {
                            html += `<button class="button disabled" style="color:#888;margin-right:5px;cursor:not-allowed;padding:5px;" disabled>✨ ${pw.name} (blocked)</button>`;
                        }
                    }

                    html += `<button class="button" name="send" value="/tcg deselect" style="float:right;">Cancel</button>`;
                    html += `<div style="clear:both;"></div>`;

                } else if (selectedCard && isTrainerCard(selectedCard)) {
                    const effect = TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name];
                    if (!effect) {
                        html += `<strong style="color:#888;">${selectedCard.name} is not yet implemented.</strong>`;
                    } else if (!effect.requiresTarget) {
                        html += `<strong style="display:block;margin-bottom:5px;">Use Trainer:</strong>`;
                        html += `<button class="button" name="send" value="/tcg playtrainer ${selectedCard.uid}" style="font-weight:bold;background:#f3e6ff;border:1px solid #9932CC;margin-right:5px;padding:5px;">🔮 Play ${selectedCard.name}</button>`;
                    } else if (effect.opponentTarget) {
                        html += `<strong style="color:red;">🎯 ${selectedCard.name}: Click a target on the opponent's field${selectedCard.name === 'Pokémon Flute' ? ' or their discard above' : ''}.</strong>`;
                    } else {
                        html += `<strong style="color:#9932CC;">🔮 ${selectedCard.name}: Click a valid target on your field.</strong>`;
                    }
                    html += `<button class="button" name="send" value="/tcg deselect" style="float:right;">Cancel</button>`;
                    html += `<div style="clear:both;"></div>`;

                } else {
                    html += `<button class="button" name="send" value="/tcg endturn" style="font-weight:bold;background:#c1e1c1;">End Turn</button> `;

                    if (match.player.active && !match.hasAttackedThisTurn) {
                        const active = match.player.active;
                        const cost = active.retreatCostCount;
                        const canDo = canRetreat(active) && active.status.volatile !== 'asleep' && active.status.volatile !== 'paralyzed' && !match.player.hasRetreatedThisTurn;
                        const benchPokemon = match.player.bench.map((b, i) => ({ b, i })).filter(({ b }) => b !== null);
                        if (benchPokemon.length > 0) {
                            html += `<span style="font-size:11px;color:#555;margin:0 6px;">Retreat (cost: ${cost} ⚡):</span>`;
                            for (const { b, i } of benchPokemon) {
                                if (canDo) {
                                    html += `<button class="button" name="send" value="/tcg retreat ${i}" style="font-size:11px;background:#fff3cd;border:1px solid #ffc107;margin:2px;">↩ ${b!.topCard.name}</button>`;
                                } else {
                                    html += `<button class="button disabled" style="font-size:11px;color:#aaa;margin:2px;cursor:not-allowed;" disabled>↩ ${b!.topCard.name}</button>`;
                                }
                            }
                        }

                        const benchPowers = match.player.bench
                            .flatMap(b => b
                                ? (b.topCard.abilities ?? [])
                                    .filter(a => a.type === 'Pokémon Power' || a.type === 'Poké-Power')
                                    .map((pw, pi) => ({ b, pi, pw }))
                                : []
                            );
                        for (const { b, pi, pw } of benchPowers) {
                            const blocked = b.isPowerBlocked();
                            if (!blocked) {
                                html += `<button class="button" name="send" value="/tcg usepower ${b.uid} ${pi}" style="font-size:11px;background:#f3e6ff;border:1px solid #9932CC;margin:2px;">✨ ${b.topCard.name}: ${pw.name}</button>`;
                            }
                        }
                    }

                    html += `<button class="button" name="send" value="/tcg quit" style="color:red;float:right;">Quit</button>`;
                    html += `<div style="clear:both;"></div>`;
                }

            } else {
                html += `<em>Waiting for AI…</em> `;
                html += `<button class="button" name="send" value="/tcg quit" style="color:red;float:right;">Quit</button>`;
                html += `<div style="clear:both;"></div>`;
            }

            html += `</div>`;

            html += `<div style="margin-top:5px;background:#222;color:#fff;padding:5px;height:100px;overflow-y:scroll;border-radius:5px;font-family:monospace;font-size:11px;">`;
            for (const log of match.logs) html += `<div>> ${log}</div>`;
            html += `</div>`;

            html += `</div>`;
            this.setHTML(html);
        }
    }
};
