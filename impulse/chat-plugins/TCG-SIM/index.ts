// chat-plugins/tcg/index.ts
import { FS } from '../../../lib';
import { TCGMatch, TCGCard, InGameCard, PokemonInstance, isBasicPokemon, isEvolutionPokemon, hasEnoughEnergy } from './engine';
import { TrainerEffects } from './effects';

let baseSetData: TCGCard[] = [];
try {
    const rawData = FS('impulse/chat-plugins/tcg-test/base1.json').readIfExistsSync();
    if (rawData) {
        const parsed = JSON.parse(rawData);
        baseSetData = Array.isArray(parsed) ? parsed : (parsed.data || []);
    }
} catch (e) {
    console.error("Failed to load Base Set JSON:", e);
}

const activeMatches = new Map<string, TCGMatch>();

function renderSlot(instance: PokemonInstance | null, context: 'active' | 'bench', targetSlot: number | 'active', isAi: boolean, match: TCGMatch): string {
    const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
    const trainerEffect = selectedCard?.supertype === 'Trainer' ? TrainerEffects[selectedCard.name] : null;

    let isSelectedField = false;
    if (instance && context === 'active' && !isAi && instance.uid === match.player.selectedUid) {
        isSelectedField = true;
    }

    const isSelectedBasic = selectedCard && isBasicPokemon(selectedCard);
    const isSelectedEnergy = selectedCard && selectedCard.supertype?.includes('Energy');
    const isSelectedEvolution = selectedCard && isEvolutionPokemon(selectedCard);
    const isTargetedTrainer = trainerEffect?.requiresTarget;

    const borderStyle = isSelectedField ? `2px solid #007bff` : `2px solid transparent`;
    const borderDashed = `1px dashed #888`;

    if (!instance) {
        let btnValue = '';
        if (!isAi && isSelectedBasic && !match.winner) {
            btnValue = `/tcg place ${targetSlot}`;
        }

        if (btnValue) {
            return `<button class="button" name="send" value="${btnValue}" style="width: 75px; height: 104px; margin: 1px; background: #e6f2ff; border: 2px dashed #007bff; border-radius: 6px; cursor: pointer; color: #007bff; font-weight: bold; font-size: 11px;">Place<br/>Here</button>`;
        } else {
            return `<div style="width: 75px; height: 104px; border: 1px dashed #888; border-radius: 6px; display: inline-block; vertical-align: top; margin: 1px; text-align: center; line-height: 104px; color: #888; font-size: 10px;">Empty</div>`;
        }
    }

    const card = instance.topCard; 
    let btnValue = '';
    let isPromotable = false;
    let isEvolvable = false;
    
    if (!match.winner && !isAi) {
        if (isSelectedEnergy) {
            btnValue = `/tcg attach ${targetSlot}`;
        } else if (isSelectedEvolution && selectedCard.evolvesFrom === card.name) {
            btnValue = `/tcg evolve ${targetSlot}`;
            isEvolvable = true;
        } else if (isTargetedTrainer) {
            btnValue = `/tcg playtrainer ${selectedCard.uid} ${targetSlot}`;
        } else if (!selectedCard && context === 'bench' && !match.player.active) {
            btnValue = `/tcg promote ${targetSlot}`;
            isPromotable = true;
        } else if (!selectedCard && context === 'active') {
            btnValue = isSelectedField ? `/tcg deselect` : `/tcg select ${instance.uid}`; 
        }
    }

    let html = `<div style="width: 75px; display: inline-block; vertical-align: top; margin: 1px; text-align: center; border: ${borderStyle}; border-radius: 6px; position: relative;">`;

    if (btnValue) {
        html += `<button class="button" name="send" value="${btnValue}" style="background: transparent; border: none; padding: 0; margin: 0; width: 100%; cursor: pointer; display: block; box-shadow: none;">`;
    }
    
    html += `<img src="${card.images.small}" style="width: 100%; border-radius: 4px; display: block;" alt="${card.name}" />`;
    
    if (btnValue) {
        if (isSelectedEnergy) {
             html += `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 123, 255, 0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 1px 1px 2px black;">Attach</div>`;
        } else if (isPromotable) {
             html += `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(40, 167, 69, 0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 1px 1px 2px black;">Promote</div>`;
        } else if (isEvolvable) {
             html += `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 193, 7, 0.4); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 1px 1px 2px black;">Evolve</div>`;
        } else if (isTargetedTrainer) {
             html += `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(153, 50, 204, 0.4); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 1px 1px 2px black;">Target</div>`;
        }
        html += `</button>`;
    }

    if (instance.currentDamage > 0) {
         html += `<div style="position: absolute; top: -2px; right: -2px; color: white; background: #e60000; font-weight: bold; border-radius: 4px; font-size: 10px; padding: 1px 4px; border: 1px solid white; pointer-events: none; box-shadow: 0 1px 2px rgba(0,0,0,0.5);">${instance.currentDamage}</div>`;
    }
    if (instance.attachedEnergy?.length > 0) {
         html += `<div style="position: absolute; bottom: -2px; right: -2px; color: white; background: #222; border-radius: 4px; font-size: 10px; padding: 1px 4px; border: 1px solid white; pointer-events: none; box-shadow: 0 1px 2px rgba(0,0,0,0.5);">⚡ ${instance.attachedEnergy.length}</div>`;
    }
    
    html += `</div>`;
    return html;
}

function renderHandCard(card: InGameCard, match: TCGMatch): string {
    const isSelected = card.uid === match.player.selectedUid;
    const borderStyle = isSelected ? `2px solid #007bff` : `2px solid transparent`;
    const btnValue = isSelected ? `/tcg deselect` : `/tcg select ${card.uid}`;

    let html = `<div style="width: 75px; display: inline-block; vertical-align: top; margin: 1px; text-align: center; border: ${borderStyle}; border-radius: 6px; position: relative;">`;

    if (!match.winner) {
        html += `<button class="button" name="send" value="${btnValue}" style="background: transparent; border: none; padding: 0; margin: 0; width: 100%; cursor: pointer; display: block; box-shadow: none;">`;
    }
    
    html += `<img src="${card.images.small}" style="width: 100%; border-radius: 4px; display: block;" alt="${card.name}" />`;
    
    if (!match.winner) html += `</button>`;
    
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
            const slot = args[1] === 'active' ? 'active' : (args[1] ? parseInt(args[1]) : undefined);
            
            if (isNaN(uid)) return this.errorReply("Invalid card.");

            if (match.playTrainer(true, uid, slot)) {
                this.refreshPage('tcg-match');
            } else {
                this.errorReply("Cannot use that Trainer right now. Does it require a valid target?");
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

        endturn(target, room, user) {
            const match = activeMatches.get(user.id);
            if (!match || match.turn !== 'player' || match.winner) return this.errorReply("Not your turn or no active match.");

            match.player.selectedUid = null; 
            match.hasAttachedEnergy = false;
            match.turn = 'ai';
            match.executeAITurn();
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

            let html = `<div class="pad" style="max-width: 850px; margin: auto; font-size: 13px;">`;

            if (match.winner) {
                const isPlayer = match.winner === 'player';
                html += `<div style="background: ${isPlayer ? '#e6ffe6' : '#ffe6e6'}; border: 2px solid ${isPlayer ? 'green' : 'red'}; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: center;">`;
                html += `<h2 style="color: ${isPlayer ? 'green' : 'red'}; margin: 0;">${isPlayer ? '🎉 YOU WIN! 🎉' : '💀 YOU LOSE! 💀'}</h2>`;
                html += `</div>`;
            }

            // --- AI Field ---
            html += `<div style="background: #e8e8e8; padding: 5px; border-radius: 6px; margin-bottom: 5px;">`;
            html += `<strong>AI Opponent</strong> (Hand: ${match.ai.hand.length} | Deck: ${match.ai.deck.length} | Prizes: ${match.ai.prizes.length})`;
            html += `<div style="display: flex; gap: 5px; margin-top: 3px;">`;
            html += `<div><strong>Active:</strong><br/>${renderSlot(match.ai.active, 'active', 'active', true, match)}</div>`;
            html += `<div style="flex-grow: 1; overflow-x: auto; white-space: nowrap;"><strong>Bench:</strong><br/>`;
            for (let i = 0; i < 5; i++) html += renderSlot(match.ai.bench[i], 'bench', i, true, match);
            html += `</div></div></div>`;

            html += `<hr style="margin: 5px 0;"/>`;

            // --- Player Field ---
            html += `<div style="background: #f0f8ff; padding: 5px; border-radius: 6px; margin-bottom: 5px;">`;
            html += `<strong>Your Field</strong> (Deck: ${match.player.deck.length} | Prizes: ${match.player.prizes.length})`;
            html += `<div style="display: flex; gap: 5px; margin-top: 3px;">`;
            html += `<div><strong>Active:</strong><br/>${renderSlot(match.player.active, 'active', 'active', false, match)}</div>`;
            html += `<div style="flex-grow: 1; overflow-x: auto; white-space: nowrap;"><strong>Bench:</strong><br/>`;
            for (let i = 0; i < 5; i++) html += renderSlot(match.player.bench[i], 'bench', i, false, match);
            html += `</div></div></div>`;

            // --- Player Hand ---
            html += `<strong>Your Hand</strong>`;
            html += `<div style="overflow-x: auto; white-space: nowrap; padding-bottom: 5px;">`;
            match.player.hand.forEach((card) => {
                html += renderHandCard(card, match); 
            });
            html += `</div>`;

            // --- Dynamic Controls Bar ---
            html += `<div style="padding: 5px; background: #fff; border-top: 1px solid #ccc;">`;
            
            if (match.winner) {
                html += `<div style="text-align: center;"><button class="button" name="send" value="/tcg quit" style="font-weight: bold; padding: 5px 15px;">Close Match</button></div>`;
            } 
            else if (match.turn === 'player') {
                const selectedCard = match.player.hand.find(c => c.uid === match.player.selectedUid);
                
                if (match.player.active && match.player.selectedUid === match.player.active.uid) {
                    html += `<strong style="display: block; margin-bottom: 5px;">Select an Attack:</strong>`;
                    
                    match.player.active.topCard.attacks?.forEach((atk, i) => {
                        const canAttack = hasEnoughEnergy(match.player.active!, i);
                        const costStr = atk.cost ? atk.cost.join(', ') : 'Free';
                        
                        if (canAttack) {
                            html += `<button class="button" name="send" value="/tcg attack ${i}" style="font-weight: bold; background: #ffe6e6; border: 1px solid red; margin-right: 5px; padding: 5px;">⚔️ ${atk.name} <br/> <span style="font-size: 9px;">(${costStr})</span></button>`;
                        } else {
                            html += `<button class="button disabled" style="color: #888; margin-right: 5px; cursor: not-allowed; padding: 5px;" disabled>⚔️ ${atk.name} <br/> <span style="font-size: 9px;">(Needs Energy)</span></button>`;
                        }
                    });
                    
                    html += `<button class="button" name="send" value="/tcg deselect" style="float: right;">Cancel</button>`;
                    html += `<div style="clear: both;"></div>`;
                } else if (selectedCard?.supertype === 'Trainer') {
                    const effect = TrainerEffects[selectedCard.name];
                    if (effect && !effect.requiresTarget) {
                        html += `<strong style="display: block; margin-bottom: 5px;">Use Trainer Card:</strong>`;
                        html += `<button class="button" name="send" value="/tcg playtrainer ${selectedCard.uid}" style="font-weight: bold; background: #f3e6ff; border: 1px solid #9932CC; margin-right: 5px; padding: 5px;">🔮 Play ${selectedCard.name}</button>`;
                    } else if (effect && effect.requiresTarget) {
                        html += `<strong style="display: block; margin-bottom: 5px; color: #9932CC;">🔮 Select a valid target on the field for ${selectedCard.name}.</strong>`;
                    } else {
                        html += `<strong style="display: block; margin-bottom: 5px; color: #888;">This Trainer card is not implemented yet.</strong>`;
                    }
                    html += `<button class="button" name="send" value="/tcg deselect" style="float: right;">Cancel</button>`;
                    html += `<div style="clear: both;"></div>`;
                } else {
                    html += `<button class="button" name="send" value="/tcg endturn" style="font-weight: bold; background: #c1e1c1;">End Turn</button> `;
                    html += `<button class="button" name="send" value="/tcg quit" style="color: red; float: right;">Quit Match</button>`;
                    html += `<div style="clear: both;"></div>`;
                }
            } else {
                html += `<em>Waiting for AI...</em> `;
                html += `<button class="button" name="send" value="/tcg quit" style="color: red; float: right;">Quit Match</button>`;
                html += `<div style="clear: both;"></div>`;
            }
            html += `</div>`;

            // --- Game Log ---
            html += `<div style="margin-top: 5px; background: #222; color: #fff; padding: 5px; height: 80px; overflow-y: scroll; border-radius: 5px; font-family: monospace; font-size: 11px;">`;
            match.logs.forEach(log => {
                html += `<div>> ${log}</div>`;
            });
            html += `</div>`;

            html += `</div>`;
            this.setHTML(html);
        }
    }
};
