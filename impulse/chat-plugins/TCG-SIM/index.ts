import { FS } from '../../../lib';
import { TCGMatch, TCGCard, InGameCard, PokemonInstance, isBasicPokemon, isEvolutionPokemon, hasEnoughEnergy, canRetreat } from './engine';
import { TrainerEffects } from './effects';

let baseSetData: TCGCard[] = [];
try {
    const rawData = FS('impulse/chat-plugins/TCG-SIM/base1.json').readIfExistsSync();
    if (rawData) {
        const parsed = JSON.parse(rawData);
        baseSetData = Array.isArray(parsed) ? parsed : (parsed.data || []);
    }
} catch (e) {
    console.error("Failed to load Base Set JSON:", e);
}

const activeMatches = new Map<string, TCGMatch>();

function renderSlot(
    instance: PokemonInstance | null,
    context: 'active' | 'bench',
    targetSlot: number | 'active',
    isAi: boolean,
    match: TCGMatch
): string {
    const player = match.player;
    const selectedCard = player.hand.find(c => c.uid === player.selectedUid);
    const trainerEffect = selectedCard?.supertype === 'Trainer'
        ? (TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name])
        : null;

    const pending = player.pendingEffect;

    const isSelectedField = !isAi && instance && context === 'active' && instance.uid === player.selectedUid;

    const isSelectedBasic    = !!selectedCard && isBasicPokemon(selectedCard);
    const isSelectedEnergy   = !!selectedCard && selectedCard.supertype?.includes('Energy');
    const isSelectedEvolution= !!selectedCard && isEvolutionPokemon(selectedCard);
    const isOwnTargetedTrainer  = !!trainerEffect?.requiresTarget && !trainerEffect?.opponentTarget;
    const isSERPending = !isAi && pending?.filter?.startsWith('ser_target:') && pending.needed === 0;
    const isOpponentTargeted = !!trainerEffect?.requiresTarget && !!trainerEffect?.opponentTarget;

    if (!instance) {
        let btnValue = '';

        if (!isAi && !match.winner) {
            if (isSelectedBasic) {
                btnValue = `/tcg place ${targetSlot}`;
            } else if (pending?.type === 'discard_for_effect' && pending.trainerName === 'Revive' && !isAi && context === 'bench') {
            }
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
                overlayColor = 'rgba(220, 53, 69, 0.4)';
            }
        } else {
            if (isSERPending && !isAi && instance.attachedEnergy.length > 0) {
                overlayLabel = 'Pick Energy';
                overlayColor = 'rgba(220,53,69,0.3)';
            } else if (pending?.trainerName === 'Pokémon Breeder' && pending.selected.length >= pending.needed && !isAi) {
                if (instance.stage === 0) {
                    btnValue = `/tcg breederplace ${targetSlot}`;
                    overlayLabel = 'Breed';
                    overlayColor = 'rgba(255, 140, 0, 0.45)';
                }
            } else if (isSelectedEnergy) {
                btnValue = `/tcg attach ${targetSlot}`;
                overlayLabel = 'Attach';
                overlayColor = 'rgba(0, 123, 255, 0.3)';
            } else if (isSelectedEvolution && selectedCard!.evolvesFrom === card.name) {
                btnValue = `/tcg evolve ${targetSlot}`;
                overlayLabel = 'Evolve';
                overlayColor = 'rgba(255, 193, 7, 0.4)';
            } else if (isOwnTargetedTrainer) {
                btnValue = `/tcg playtrainer ${selectedCard!.uid} ${targetSlot}`;
                overlayLabel = 'Target';
                overlayColor = 'rgba(153, 50, 204, 0.4)';
            } else if (!selectedCard && context === 'bench' && !player.active) {
                btnValue = `/tcg promote ${targetSlot}`;
                overlayLabel = 'Promote';
                overlayColor = 'rgba(40, 167, 69, 0.3)';
            } else if (!selectedCard && context === 'active') {
                btnValue = isSelectedField ? `/tcg deselect` : `/tcg select ${instance.uid}`;
            }
        }
    }

    const borderStyle = isSelectedField ? `2px solid #007bff` : `2px solid transparent`;
    let html = `<div style="width:75px;display:inline-block;vertical-align:top;margin:1px;text-align:center;border:${borderStyle};border-radius:6px;position:relative;">`;

    if (btnValue) {
        html += `<button class="button" name="send" value="${btnValue}" style="background:transparent;border:none;padding:0;margin:0;width:100%;cursor:pointer;display:block;box-shadow:none;">`;
    }

    html += `<img src="${card.images.small}" style="width:100%;border-radius:4px;display:block;" alt="${card.name}" />`;

    if (btnValue && overlayLabel) {
        html += `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:${overlayColor};border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;text-shadow:1px 1px 2px black;">${overlayLabel}</div>`;
    }
    if (btnValue) html += `</button>`;

    if (instance.currentDamage > 0) {
        html += `<div style="position:absolute;top:-2px;right:-2px;color:white;background:#e60000;font-weight:bold;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid white;pointer-events:none;">-${instance.currentDamage}</div>`;
    }
    if (instance.attachedEnergy.length > 0) {
        html += `<div style="position:absolute;bottom:-2px;right:-2px;color:white;background:#222;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid white;pointer-events:none;">⚡${instance.attachedEnergy.length}</div>`;
    }
    if (instance.attachedItems.length > 0) {
        const itemNames = instance.attachedItems.map(i =>
            i.card.name === 'PlusPower' ? '➕' : i.card.name === 'Defender' ? '🛡' : '📎'
        ).join('');
        html += `<div style="position:absolute;bottom:-2px;left:-2px;color:white;background:#555;border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid white;pointer-events:none;">${itemNames}</div>`;
    }

    if (instance.status) {
        const statusColors: Record<string, string> = {
            poisoned: '#9b59b6', burned: '#e67e22', asleep: '#3498db',
            confused: '#f39c12', paralyzed: '#f1c40f',
        };
        const statusEmoji: Record<string, string> = {
            poisoned: '☠', burned: '🔥', asleep: '💤', confused: '😵', paralyzed: '⚡',
        };
        const sc = instance.status;
        html += `<div style="position:absolute;top:-2px;left:-2px;color:white;background:${statusColors[sc] ?? '#888'};border-radius:4px;font-size:10px;padding:1px 4px;border:1px solid white;pointer-events:none;">${statusEmoji[sc] ?? '?'}</div>`;
    }

    html += `</div>`;
    return html;
}

function renderHandCard(card: InGameCard, match: TCGMatch): string {
    const isSelected = card.uid === match.player.selectedUid;
    const pending = match.player.pendingEffect;

    const isPendingCandidate = pending && !pending.selected.includes(card.uid) && card.uid !== pending.trainerUid;
    const isPendingSelected  = pending && pending.selected.includes(card.uid);

    let border = isSelected ? `2px solid #007bff` : `2px solid transparent`;
    if (isPendingSelected) border = `2px solid #e67e00`;
    if (isPendingCandidate) border = `1px dashed #e67e00`;

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
    if (btnValue) {
        html += `<button class="button" name="send" value="${btnValue}" style="background:transparent;border:none;padding:0;margin:0;width:100%;cursor:pointer;display:block;box-shadow:none;">`;
    }
    html += `<img src="${card.images.small}" style="width:100%;border-radius:4px;display:block;" alt="${card.name}" />`;
    if (btnValue) html += `</button>`;
    if (isPendingSelected) {
        html += `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(230,126,0,0.35);border-radius:4px;pointer-events:none;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;text-shadow:1px 1px 2px black;">✓</div>`;
    }
    html += `</div>`;
    return html;
}

function renderDiscardCard(card: InGameCard, index: number, cmdPrefix: string, highlight = false): string {
    const border = highlight ? `2px solid #007bff` : `1px solid #666`;
    return `<button class="button" name="send" value="${cmdPrefix} ${index}" style="background:transparent;border:${border};padding:0;margin:1px;width:55px;cursor:pointer;border-radius:4px;vertical-align:top;display:inline-block;">` +
        `<img src="${card.images.small}" style="width:100%;border-radius:3px;display:block;" alt="${card.name}" />` +
        `</button>`;
}

function renderPokedexUI(match: TCGMatch): string {
    const top5 = match.player.deck.slice(0, 5);
    let html = `<div style="background:#1a1a2e;padding:8px;border-radius:6px;margin-bottom:5px;">`;
    html += `<strong style="color:#fff;display:block;margin-bottom:4px;">🔍 Pokédex — Rearrange top ${top5.length} cards (click to move to bottom of this preview):</strong>`;
    html += `<div style="overflow-x:auto;white-space:nowrap;">`;
    for (let i = 0; i < top5.length; i++) {
        const c = top5[i];
        html += `<button class="button" name="send" value="/tcg pokedexmove ${i}" style="background:transparent;border:1px solid #aaa;padding:0;margin:1px;width:55px;cursor:pointer;border-radius:4px;vertical-align:top;display:inline-block;">` +
            `<img src="${c.images.small}" style="width:100%;border-radius:3px;display:block;" alt="${c.name}"/>` +
            `</button>`;
    }
    html += `</div>`;
    html += `<div style="margin-top:4px;text-align:right;">`;
    html += `<button class="button" name="send" value="/tcg pokedexconfirm" style="font-weight:bold;background:#28a745;color:white;margin-right:4px;">Confirm Order</button>`;
    html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;">Cancel</button>`;
    html += `</div></div>`;
    return html;
}

function renderPendingUI(match: TCGMatch): string {
    const pending = match.player.pendingEffect!;
    let html = `<div style="background:#fff3cd;border:1px solid #ffc107;padding:8px;border-radius:6px;margin-bottom:5px;">`;
    html += `<strong>🃏 ${pending.trainerName}</strong> — `;

    switch (pending.type) {
        case 'discard_for_effect': {
            if (pending.filter?.startsWith('superpotion_target:') && pending.needed === 0) {
                const slotStr = pending.filter.replace('superpotion_target:', '');
                const slot: 'active' | number = slotStr === 'active' ? 'active' : parseInt(slotStr);
                const inst = slot === 'active' ? match.player.active : match.player.bench[slot as number];
                if (!inst) { html += `Target Pokémon not found.`; break; }
                html += `Pick 1 Energy to discard from <strong>${inst.topCard.name}</strong>:`;
                html += `</div><div style="background:#fff3cd;border:1px solid #ffc107;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                for (let eIdx = 0; eIdx < inst.attachedEnergy.length; eIdx++) {
                    const e = inst.attachedEnergy[eIdx];
                    html += `<button class="button" name="send" value="/tcg superpotionpick ${eIdx}" style="background:transparent;border:1px solid #e67e00;padding:2px 4px;margin:2px;border-radius:4px;cursor:pointer;">`;
                    html += `<img src="${e.images.small}" style="width:40px;display:block;" alt="${e.name}"/>`;
                    html += `<span style="font-size:9px;">${e.name}</span></button>`;
                }
                html += `</div>`;
                html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;margin-top:4px;">Cancel</button>`;
                break;
            }
            if (pending.filter?.startsWith('ser_target:') && pending.needed === 0) {
                html += `Pick 1 Energy card from your own Pokémon to discard:`;
                html += `</div><div style="background:#ffe0e0;border:1px solid #dc3545;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                const allInPlay = match.player.getAllInPlay();
                for (const inst of allInPlay) {
                    for (let eIdx = 0; eIdx < inst.attachedEnergy.length; eIdx++) {
                        const e = inst.attachedEnergy[eIdx];
                        html += `<button class="button" name="send" value="/tcg serownpick ${inst.uid} ${eIdx}" style="background:transparent;border:1px solid #dc3545;padding:2px 4px;margin:2px;border-radius:4px;cursor:pointer;font-size:11px;">`;
                        html += `<img src="${e.images.small}" style="width:40px;display:block;" alt="${e.name}"/>`;
                        html += `<span style="font-size:9px;">${inst.topCard.name}</span>`;
                        html += `</button>`;
                    }
                }
                html += `</div>`;
                html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;margin-top:4px;">Cancel</button>`;
                break;
            }
            const remaining = pending.needed - pending.selected.length;
            if (remaining > 0) {
                if (pending.filter === 'stage2_hand') {
                    html += `Select the <strong>Stage 2 Pokémon</strong> from your hand to place (orange highlight = selected). Then click the matching Basic on your field.`;
                } else {
                    html += `Select ${remaining} more card${remaining > 1 ? 's' : ''} from your hand to discard/return (orange highlight = selected).`;
                }
                if (pending.selected.length > 0) {
                    html += ` <button class="button" name="send" value="/tcg pendingclearsel" style="font-size:10px;margin-left:4px;">Clear</button>`;
                }
            } else {
                if (pending.trainerName === 'Computer Search') {
                    html += `Now pick any card from your deck:`;
                    html += `</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                    for (let i = 0; i < match.player.deck.length; i++) {
                        html += renderDiscardCard(match.player.deck[i], i, '/tcg pendingfinish deck');
                    }
                } else if (pending.trainerName === 'Item Finder') {
                    const trainers = match.player.discard
                        .map((c, i) => ({ c, i }))
                        .filter(({ c }) => c.supertype === 'Trainer');
                    if (trainers.length === 0) {
                        html += `No Trainers in discard. `;
                        html += `<button class="button" name="send" value="/tcg pendingcancel">Cancel</button>`;
                    } else {
                        html += `Pick a Trainer from your discard:`;
                        html += `</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                        for (const { c, i } of trainers) {
                            html += renderDiscardCard(c, i, '/tcg pendingfinish discard');
                        }
                    }
                } else if (pending.trainerName === 'Energy Retrieval') {
                    const basicEnergies = match.player.discard
                        .map((c, i) => ({ c, i }))
                        .filter(({ c }) => c.supertype === 'Energy' && c.subtypes?.includes('Basic'));
                    if (basicEnergies.length === 0) {
                        html += `No basic Energy in discard. `;
                        html += `<button class="button" name="send" value="/tcg pendingcancel">Cancel</button>`;
                    } else {
                        html += `Pick up to 2 basic Energies from your discard (click each):`;
                        html += `</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                        for (const { c, i } of basicEnergies) {
                            html += renderDiscardCard(c, i, '/tcg pendingfinish discard');
                        }
                    }
                } else if (pending.trainerName === 'Pokémon Trader') {
                    html += `Pick a Pokémon from your deck to take:`;
                    html += `</div><div style="background:#f8f9fa;border:1px solid #dee2e6;padding:5px;border-radius:5px;overflow-x:auto;white-space:nowrap;">`;
                    const deckPokemon = match.player.deck
                        .map((c, i) => ({ c, i }))
                        .filter(({ c }) => isBasicPokemon(c) || isEvolutionPokemon(c));
                    for (const { c, i } of deckPokemon) {
                        html += renderDiscardCard(c, i, '/tcg pendingfinish deck');
                    }
                } else if (pending.trainerName === 'Maintenance') {
                    html += `Shuffling cards back... `;
                    html += `<button class="button" name="send" value="/tcg pendingfinish confirm 0" style="font-weight:bold;">Confirm & Draw 1</button>`;
                }
            }
            break;
        }
        case 'pick_from_discard': {
            html += `Pick from your discard pile:`;
            break;
        }
        case 'pick_from_deck': {
            break;
        }
    }

    html += `</div>`;

    if (pending.type === 'discard_for_effect' && pending.selected.length < pending.needed) {
        html += `<button class="button" name="send" value="/tcg pendingcancel" style="color:red;font-size:11px;">Cancel ${pending.trainerName}</button>`;
    }

    return html;
}

function renderOpponentDiscardPicker(match: TCGMatch, filter: 'basic' | 'all'): string {
    const cards = match.ai.discard
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => filter === 'all' || isBasicPokemon(c));
    if (cards.length === 0) return `<em style="color:#888;">Opponent's discard is empty.</em>`;
    let html = `<div style="overflow-x:auto;white-space:nowrap;">`;
    for (const { c, i } of cards) {
        html += renderDiscardCard(c, i, '/tcg playtargetdiscard', false);
    }
    html += `</div>`;
    return html;
}

export const commands: Chat.ChatCommands = {
    tcg: {
        start(target, room, user) {
            if (!baseSetData.length) return this.errorReply("TCG Data not loaded on server.");
            if (activeMatches.has(user.id)) return this.errorReply("You already have a match. Use /join view-tcg-match");
            activeMatches.set(user.id, new TCGMatch(user.id, baseSetData));
            this.parse('/join view-tcg-match');
        },

        select(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            if (match.player.pendingEffect) return this.errorReply("Complete or cancel the current effect first.");
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
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            if (match.player.selectedUid === null) return this.errorReply("No card selected.");
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.playBasicPokemon(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot place card there.");
            }
        },

        evolve(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            if (match.player.selectedUid === null) return this.errorReply("No card selected.");
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.evolvePokemon(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot evolve. Does the name match?");
            }
        },

        attach(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            if (match.player.selectedUid === null) return this.errorReply("No card selected.");
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.attachEnergy(true, match.player.selectedUid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("You can only attach 1 Energy per turn!");
            }
        },

        playtrainer(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            const args = target.split(' ');
            const uid = parseInt(args[0]);
            const slot = args[1] === 'active' ? 'active' : (args[1] !== undefined ? parseInt(args[1]) : undefined);
            if (isNaN(uid)) return this.errorReply("Invalid card.");
            if (match.playTrainer(true, uid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                if (match.player.pendingEffect) {
                    this.refreshPage('tcg-match');
                } else {
                    this.errorReply("Cannot use that Trainer right now.");
                }
            }
        },

        playtargetdiscard(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn.");
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply("Invalid index.");
            const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
            if (!selectedCard) return this.errorReply("No card selected.");
            if (match.playTrainer(true, selectedCard.uid, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot use that Trainer on that target.");
            }
        },

        promote(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply("Invalid bench index.");
            if (match.promote(true, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Could not promote that Pokémon.");
            }
        },

        attack(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            const index = parseInt(target);
            if (isNaN(index)) return this.errorReply("Invalid attack index.");
            if (match.attack(true, index)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot attack! Do you have enough Energy?");
            }
        },

        retreat(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or game is over.");
            if (match.player.pendingEffect) return this.errorReply("Complete or cancel the current effect first.");
            if (match.hasAttackedThisTurn) return this.errorReply("You cannot retreat after attacking.");
            const benchIndex = parseInt(target);
            if (isNaN(benchIndex)) return this.errorReply("Invalid bench index.");
            if (match.retreat(true, benchIndex)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot retreat right now.");
            }
        },

        endturn(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or no active match.");
            if (match.player.pendingEffect) return this.errorReply("Complete or cancel the current effect first.");
            match.endPlayerTurn();
            match.executeAITurn();
            this.refreshPage('tcg-match');
        },

        pendingselect(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const uid = parseInt(target);
            const pending = match.player.pendingEffect;
            if (pending.selected.length >= pending.needed) return this.errorReply("Already selected enough cards.");
            const card = match.player.hand.find(c => c.uid === uid);
            if (!card) return this.errorReply("Card not in hand.");
            if (uid === pending.trainerUid) return this.errorReply("Cannot select the Trainer card itself.");
            if (pending.filter === 'stage2_hand' && !card.subtypes?.includes('Stage 2')) {
                return this.errorReply("Pokémon Breeder requires a Stage 2 Pokémon.");
            }
            if (pending.filter === 'pokemon_hand' && !isBasicPokemon(card) && !isEvolutionPokemon(card)) {
                return this.errorReply("Pokémon Trader requires a Pokémon card.");
            }
            if (!pending.selected.includes(uid)) {
                pending.selected.push(uid);
            }
            this.refreshPage('tcg-match');
        },

        pendingdeselect(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const uid = parseInt(target);
            const pending = match.player.pendingEffect;
            pending.selected = pending.selected.filter(id => id !== uid);
            this.refreshPage('tcg-match');
        },

        pendingclearsel(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            match.player.pendingEffect.selected = [];
            this.refreshPage('tcg-match');
        },

        pendingcancel(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        pendingfinish(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const [source, idxStr] = target.split(' ');
            const idx = parseInt(idxStr);
            const pending = match.player.pendingEffect;
            const player = match.player;

            if (pending.selected.length < pending.needed) {
                return this.errorReply(`Still need to select ${pending.needed - pending.selected.length} more card(s).`);
            }

            const toDiscard = pending.selected
                .map(uid => player.hand.find(c => c.uid === uid))
                .filter(Boolean) as InGameCard[];

            switch (pending.trainerName) {
                case 'Computer Search':
                case 'Item Finder':
                case 'Energy Retrieval': {
                    for (const c of toDiscard) {
                        player.hand.splice(player.hand.indexOf(c), 1);
                        player.discard.push(c);
                    }
                    break;
                }
                case 'Maintenance':
                case 'Pokémon Trader': {
                    for (const c of toDiscard) {
                        player.hand.splice(player.hand.indexOf(c), 1);
                        player.deck.push(c);
                    }
                    for (let i = player.deck.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
                    }
                    break;
                }
            }

            if (source === 'deck' && !isNaN(idx)) {
                const picked = player.deck.splice(idx, 1)[0];
                if (picked) {
                    player.hand.push(picked);
                    match.addLog(`${pending.trainerName}: Picked ${picked.name} from deck.`);
                }
            } else if (source === 'discard' && !isNaN(idx)) {
                if (pending.trainerName === 'Energy Retrieval') {
                    const picked = player.discard[idx];
                    if (picked) {
                        player.discard.splice(idx, 1);
                        player.hand.push(picked);
                        match.addLog(`Energy Retrieval: Retrieved ${picked.name}.`);
                        if (!pending.filter?.startsWith('energy_retrieval_done')) {
                            pending.filter = 'energy_retrieval_done_1';
                            this.refreshPage('tcg-match');
                            return;
                        }
                    }
                } else {
                    const picked = player.discard[idx];
                    if (picked) {
                        player.discard.splice(idx, 1);
                        player.hand.push(picked);
                        match.addLog(`${pending.trainerName}: Retrieved ${picked.name} from discard.`);
                    }
                }
            } else if (source === 'confirm') {
                if (pending.trainerName === 'Maintenance') {
                    player.draw(1);
                    match.addLog(`Maintenance: Drew 1 card.`);
                }
            }

            const trainerIdx = player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (trainerIdx !== -1) {
                player.discard.push(player.hand.splice(trainerIdx, 1)[0]);
            }

            player.pendingEffect = null;
            player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        superpotionpick(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const pending = match.player.pendingEffect;
            if (!pending.filter?.startsWith('superpotion_target:')) return this.errorReply("No Super Potion effect active.");

            const eIdx = parseInt(target);
            if (isNaN(eIdx)) return this.errorReply("Invalid index.");

            const slotStr = pending.filter.replace('superpotion_target:', '');
            const slot: 'active' | number = slotStr === 'active' ? 'active' : parseInt(slotStr);
            const inst = slot === 'active' ? match.player.active : match.player.bench[slot as number];
            if (!inst || eIdx >= inst.attachedEnergy.length) return this.errorReply("Invalid energy target.");

            const discarded = inst.attachedEnergy.splice(eIdx, 1)[0];
            match.player.discard.push(discarded);
            inst.currentDamage = Math.max(0, inst.currentDamage - 40);
            match.addLog(`Player used Super Potion on ${inst.topCard.name}: discarded ${discarded.name}, healed 40 damage.`);

            const trainerIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (trainerIdx !== -1) match.player.discard.push(match.player.hand.splice(trainerIdx, 1)[0]);
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        serownpick(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const pending = match.player.pendingEffect;
            if (!pending.filter?.startsWith('ser_target:')) return this.errorReply("No SER effect active.");

            const [instUidStr, eIdxStr] = target.split(' ');
            const instUid = parseInt(instUidStr);
            const eIdx = parseInt(eIdxStr);
            if (isNaN(instUid) || isNaN(eIdx)) return this.errorReply("Invalid selection.");

            const inst = match.player.getAllInPlay().find(i => i.uid === instUid);
            if (!inst || eIdx >= inst.attachedEnergy.length) return this.errorReply("Invalid energy target.");

            const selfDiscarded = inst.attachedEnergy.splice(eIdx, 1)[0];
            match.player.discard.push(selfDiscarded);

            const targetSlotStr = pending.filter.replace('ser_target:', '');
            const targetSlot: 'active' | number = targetSlotStr === 'active' ? 'active' : parseInt(targetSlotStr);
            const opponent = match.ai;
            const oppTarget = targetSlot === 'active' ? opponent.active : opponent.bench[targetSlot as number];
            if (oppTarget) {
                const removed: string[] = [];
                for (let i = 0; i < 2 && oppTarget.attachedEnergy.length > 0; i++) {
                    const r = oppTarget.attachedEnergy.pop()!;
                    opponent.discard.push(r);
                    removed.push(r.name);
                }
                match.addLog(`Player used Super Energy Removal! Discarded ${selfDiscarded.name} from own side; removed ${removed.join(', ')} from ${oppTarget.topCard.name}.`);
            }

            const trainerIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (trainerIdx !== -1) match.player.discard.push(match.player.hand.splice(trainerIdx, 1)[0]);
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            this.refreshPage('tcg-match');
        },

        pokedexmove(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect || match.player.pendingEffect.trainerName !== 'Pokédex') {
                return this.errorReply("No Pokédex effect active.");
            }
            const idx = parseInt(target);
            if (isNaN(idx) || idx < 0 || idx >= 5) return this.errorReply("Invalid index.");
            const top5 = match.player.deck.splice(0, 5);
            const moved = top5.splice(idx, 1)[0];
            top5.push(moved);
            match.player.deck.unshift(...top5);
            this.refreshPage('tcg-match');
        },

        breederplace(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect || match.player.pendingEffect.trainerName !== 'Pokémon Breeder') {
                return this.errorReply("No active Pokémon Breeder effect.");
            }
            const pending = match.player.pendingEffect;
            if (pending.selected.length < pending.needed) {
                return this.errorReply("Select a Stage 2 from your hand first.");
            }
            const stage2Uid = pending.selected[0];
            const slot = target === 'active' ? 'active' : parseInt(target);
            if (match.evolvePokemon(true, stage2Uid, slot, true)) {
                const trainerIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
                if (trainerIdx !== -1) {
                    match.player.discard.push(match.player.hand.splice(trainerIdx, 1)[0]);
                }
                match.player.pendingEffect = null;
                match.player.selectedUid = null;
                match.addLog(`Player played Pokémon Breeder!`);
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot place that Stage 2 on that Pokémon. Check the evolution chain and that the Basic was in play before this turn.");
            }
        },

        pokedexconfirm(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || !match.player.pendingEffect) return this.errorReply("No active effect.");
            const pending = match.player.pendingEffect;
            const trainerIdx = match.player.hand.findIndex(c => c.uid === pending.trainerUid);
            if (trainerIdx !== -1) {
                match.player.discard.push(match.player.hand.splice(trainerIdx, 1)[0]);
            }
            match.player.pendingEffect = null;
            match.player.selectedUid = null;
            match.addLog(`Pokédex: Top of deck rearranged.`);
            this.refreshPage('tcg-match');
        },

        quit(target, room, user) {
            if (activeMatches.has(user.id)) {
                activeMatches.delete(user.id);
                this.sendReply("You have exited the TCG table.");
                this.closePage('tcg-match');
            }
        }
    }
};

export const pages: Chat.PageTable = {
    tcg: {
        match(query, user, connection) {
            this.title = '[TCG] Table';
            const match = activeMatches.get(user.id);

            if (!match) {
                return this.setHTML(`<div class="pad"><h2>Pokémon TCG Simulator</h2><p>No active match.</p><button class="button" name="send" value="/tcg start">Start Match vs AI</button></div>`);
            }

            let html = `<div class="pad" style="max-width:850px;margin:auto;font-size:13px;">`;

            if (match.winner) {
                const win = match.winner === 'player';
                html += `<div style="background:${win ? '#e6ffe6' : '#ffe6e6'};border:2px solid ${win ? 'green' : 'red'};padding:10px;border-radius:6px;margin-bottom:10px;text-align:center;">`;
                html += `<h2 style="color:${win ? 'green' : 'red'};margin:0;">${win ? '🎉 YOU WIN! 🎉' : '💀 YOU LOSE! 💀'}</h2>`;
                html += `</div>`;
            }

            const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
            const trainerEffect = selectedCard?.supertype === 'Trainer'
                ? (TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name])
                : null;
            const isOpponentTargetedTrainer = !!trainerEffect?.requiresTarget && !!trainerEffect?.opponentTarget;

            html += `<div style="background:${isOpponentTargetedTrainer ? '#ffe8e8' : '#e8e8e8'};padding:5px;border-radius:6px;margin-bottom:5px;">`;
            html += `<strong>AI Opponent</strong> (Hand: ${match.ai.hand.length} | Deck: ${match.ai.deck.length} | Prizes: ${match.ai.prizes.length}${match.ai.discard.length > 0 ? ` | Discard: ${match.ai.discard.length}` : ''})`;
            if (isOpponentTargetedTrainer) {
                html += ` <span style="color:red;font-weight:bold;">← Click a target</span>`;
            }
            html += `<div style="display:flex;gap:5px;margin-top:3px;">`;
            html += `<div><strong>Active:</strong><br/>${renderSlot(match.ai.active, 'active', 'active', true, match)}</div>`;
            html += `<div style="flex-grow:1;overflow-x:auto;white-space:nowrap;"><strong>Bench:</strong><br/>`;
            for (let i = 0; i < 5; i++) html += renderSlot(match.ai.bench[i], 'bench', i, true, match);
            html += `</div></div>`;

            if (isOpponentTargetedTrainer && selectedCard?.name === 'Pokémon Flute') {
                html += `<div style="margin-top:4px;"><strong style="font-size:11px;">Opponent's Discard (pick a Basic):</strong><br/>`;
                html += renderOpponentDiscardPicker(match, 'basic');
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

            html += `<strong>Your Hand</strong>`;
            html += `<div style="overflow-x:auto;white-space:nowrap;padding-bottom:5px;">`;
            for (const card of match.player.hand) {
                html += renderHandCard(card, match);
            }
            html += `</div>`;

            html += `<div style="padding:5px;background:#fff;border-top:1px solid #ccc;">`;

            if (match.winner) {
                html += `<div style="text-align:center;"><button class="button" name="send" value="/tcg quit" style="font-weight:bold;padding:5px 15px;">Close Match</button></div>`;
            } else if (match.turn === 'player') {

                if (pending) {
                    html += `<em style="color:#888;">Complete the card effect above to continue.</em>`;
                } else if (match.player.active && match.player.selectedUid === match.player.active.uid) {
                    html += `<strong style="display:block;margin-bottom:5px;">Select an Attack:</strong>`;
                    match.player.active.topCard.attacks?.forEach((atk, i) => {
                        const canAttack = hasEnoughEnergy(match.player.active!, i);
                        const costStr = atk.cost?.join(', ') ?? 'Free';
                        if (canAttack) {
                            html += `<button class="button" name="send" value="/tcg attack ${i}" style="font-weight:bold;background:#ffe6e6;border:1px solid red;margin-right:5px;padding:5px;">⚔️ ${atk.name}<br/><span style="font-size:9px;">(${costStr})</span></button>`;
                        } else {
                            html += `<button class="button disabled" style="color:#888;margin-right:5px;cursor:not-allowed;padding:5px;" disabled>⚔️ ${atk.name}<br/><span style="font-size:9px;">(Needs Energy)</span></button>`;
                        }
                    });
                    html += `<button class="button" name="send" value="/tcg deselect" style="float:right;">Cancel</button>`;
                    html += `<div style="clear:both;"></div>`;

                } else if (selectedCard?.supertype === 'Trainer') {
                    const effect = TrainerEffects[selectedCard.id] ?? TrainerEffects[selectedCard.name];
                    if (!effect) {
                        html += `<strong style="color:#888;">This Trainer card (${selectedCard.name}) is not implemented yet.</strong>`;
                    } else if (!effect.requiresTarget) {
                        html += `<strong style="display:block;margin-bottom:5px;">Use Trainer Card:</strong>`;
                        html += `<button class="button" name="send" value="/tcg playtrainer ${selectedCard.uid}" style="font-weight:bold;background:#f3e6ff;border:1px solid #9932CC;margin-right:5px;padding:5px;">🔮 Play ${selectedCard.name}</button>`;
                    } else if (effect.opponentTarget) {
                        html += `<strong style="color:red;">🎯 ${selectedCard.name}: Click a target on the opponent's field${selectedCard.name === 'Pokémon Flute' ? ' or their discard pile above' : ''}.</strong>`;
                    } else {
                        html += `<strong style="color:#9932CC;">🔮 ${selectedCard.name}: Click a valid target on your field.</strong>`;
                    }
                    html += `<button class="button" name="send" value="/tcg deselect" style="float:right;">Cancel</button>`;
                    html += `<div style="clear:both;"></div>`;

                } else {
                    html += `<button class="button" name="send" value="/tcg endturn" style="font-weight:bold;background:#c1e1c1;">End Turn</button> `;

                    if (match.player.active && !match.hasAttackedThisTurn) {
                        const active = match.player.active;
                        const retreatCost = active.retreatCostCount;
                        const canDo = canRetreat(active) && active.status !== 'asleep' && active.status !== 'paralyzed';
                        const benchPokemon = match.player.bench
                            .map((b, i) => ({ b, i }))
                            .filter(({ b }) => b !== null);
                        if (benchPokemon.length > 0) {
                            html += `<span style="font-size:11px;color:#555;margin-left:6px;">Retreat (costs ${retreatCost} ⚡):</span> `;
                            for (const { b, i } of benchPokemon) {
                                if (canDo) {
                                    html += `<button class="button" name="send" value="/tcg retreat ${i}" style="font-size:11px;background:#fff3cd;border:1px solid #ffc107;margin:2px;">↩ ${b!.topCard.name}</button>`;
                                } else {
                                    html += `<button class="button disabled" style="font-size:11px;color:#aaa;margin:2px;cursor:not-allowed;" disabled>↩ ${b!.topCard.name}</button>`;
                                }
                            }
                        }
                    }

                    html += `<button class="button" name="send" value="/tcg quit" style="color:red;float:right;">Quit Match</button>`;
                    html += `<div style="clear:both;"></div>`;
                }

            } else {
                html += `<em>Waiting for AI...</em> `;
                html += `<button class="button" name="send" value="/tcg quit" style="color:red;float:right;">Quit Match</button>`;
                html += `<div style="clear:both;"></div>`;
            }

            html += `</div>`;

            html += `<div style="margin-top:5px;background:#222;color:#fff;padding:5px;height:80px;overflow-y:scroll;border-radius:5px;font-family:monospace;font-size:11px;">`;
            for (const log of match.logs) {
                html += `<div>> ${log}</div>`;
            }
            html += `</div>`;

            html += `</div>`;
            this.setHTML(html);
        }
    }
};
