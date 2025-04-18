/**
 * Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows users to battle against a server-controlled AI opponent.
 */

import type {Battle} from '../sim/battle';

export class ServerAI {
    makeDecision(battle: Battle, serverSide: number): string {
        try {
            const activePokemon = battle.sides[serverSide].active[0];
            if (!activePokemon) return 'default';

            const possibleMoves = [];
            for (const moveSlot of activePokemon.moveSlots) {
                if (!moveSlot.disabled) {
                    possibleMoves.push(moveSlot.id);
                }
            }

            if (possibleMoves.length === 0) return 'default'; // Use struggle

            // Pick a random move
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            return `move ${move}`;
        } catch (e) {
            console.error("Error in makeDecision:", e);
            return 'default';
        }
    }
}

export const commands: Chat.ChatCommands = {
    serverbattle: 'battleserver',
    battleserver: {
        async ''(target, room, user) {
            if (!this.canTalk()) return;
            
            try {
                // Default to random battle format
                const format = Dex.formats.get('gen9randombattle');
                if (!format.exists) {
                    throw new Chat.ErrorMessage(`Format gen9randombattle not found.`);
                }

                // Create teams for both players
                const teams = [null, null]; // Use random teams
                
                // Create battle options
                const options = {
                    format: format,
                    rated: false
                };

                // Create the battle
                const battle = await Rooms.createBattle(options);
                if (!battle) {
                    throw new Chat.ErrorMessage(`Failed to create battle.`);
                }

                // Set up the players
                battle.setPlayer('p1', {
                    name: user.name,
                    avatar: user.avatar,
                    team: teams[0]
                });

                battle.setPlayer('p2', {
                    name: "Server",
                    avatar: "1",
                    team: teams[1]
                });

                // Initialize server AI
                const serverAI = new ServerAI();
                
                // Handle server's turns
                battle.battle?.stream.on('message', (chunk: string) => {
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('|request|')) {
                            try {
                                const request = JSON.parse(line.slice(9));
                                if (request.side?.id === 'p2') { // Server's turn
                                    const decision = serverAI.makeDecision(battle.battle!, 1);
                                    void battle.battle?.makeChoices('default', decision);
                                }
                            } catch (e) {
                                console.error('Error handling battle request:', e);
                            }
                        }
                    }
                });

                // Join the battle room
                if (battle.roomid) {
                    user.joinRoom(battle.roomid);
                    this.parse(`/join ${battle.roomid}`);
                }

            } catch (e) {
                console.error("Error in serverbattle command:", e);
                throw new Chat.ErrorMessage(`Failed to create server battle: ${(e as Error).message}`);
            }
        },

        help() {
            return this.sendReplyBox(
                `Server Battle Commands:<br />` +
                `<code>/serverbattle</code> or <code>/battleserver</code> - Start a battle against the server AI<br />` +
                `The server currently uses basic AI with random move selection.`
            );
        },
    },
};
