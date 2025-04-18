/**
 * Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows users to battle against a server-controlled AI opponent.
 */

import type {Battle} from '../sim/battle';

interface AIDecision {
    choice: string;
    type: 'move' | 'switch' | 'default';
}

export class ServerAI {
    makeDecision(battle: Battle, serverSide: number): AIDecision {
        try {
            const activePokemon = battle.sides[serverSide].active[0];
            if (!activePokemon) return { choice: 'default', type: 'default' };

            const possibleMoves = [];
            for (const moveSlot of activePokemon.moveSlots) {
                if (!moveSlot.disabled) {
                    possibleMoves.push(moveSlot.id);
                }
            }

            if (possibleMoves.length === 0) {
                return { choice: 'default', type: 'default' }; // Use struggle
            }

            // Pick a random move
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            return { choice: `move ${move}`, type: 'move' };
        } catch (e) {
            console.error("Error in makeDecision:", e);
            return { choice: 'default', type: 'default' };
        }
    }
}

// Create a global instance of the AI
const serverAI = new ServerAI();

export const commands: Chat.ChatCommands = {
    serverbattle: 'battleserver',
    battleserver: {
        async ''(target, room, user) {
            if (!this.canTalk()) return;
            
            try {
                // Default to random battle format
                const formatid = 'gen9randombattle';
                const format = Dex.formats.get(formatid);
                
                if (!format.exists) {
                    throw new Chat.ErrorMessage(`Invalid format: ${formatid}`);
                }

                if (!format.team) {
                    throw new Chat.ErrorMessage(`Format ${format.name} requires a team - try using gen9randombattle instead.`);
                }

                // Create battle room
                const options = {
                    format: formatid,
                    auth: {
                        p1: user.id,
                        p2: 'server',
                    },
                };

                const roomid = `battle-${format.id}-${Date.now()}`;
                const battleRoom = Rooms.createGameRoom(roomid, `[${format.name}] ${user.name} vs. Server`, options);
                
                if (!battleRoom) {
                    throw new Chat.ErrorMessage(`Failed to create battle room.`);
                }

                const battle = battleRoom.game as Battle;
                if (!battle) {
                    throw new Chat.ErrorMessage(`Failed to create battle.`);
                }

                // Set up players
                const p1 = {
                    user: user,
                    team: null, // Let the simulator generate a random team
                };

                const p2 = {
                    user: null,
                    name: 'Server',
                    team: null, // Let the simulator generate a random team
                };

                battle.setPlayer('p1', p1);
                battle.setPlayer('p2', p2);

                // Handle server's moves
                battleRoom.battle?.stream.on('message', async (chunk: string) => {
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('|request|')) {
                            try {
                                const request = JSON.parse(line.slice(9));
                                if (request.side?.id === 'p2') { // Server's turn
                                    const decision = serverAI.makeDecision(battle, 1);
                                    if (decision.choice) {
                                        await battle.choose('p2', decision.choice);
                                    }
                                }
                            } catch (e) {
                                console.error('Error handling battle request:', e);
                            }
                        }
                    }
                });

                // Join user to the room
                if (!user.games.has(roomid)) {
                    user.games.add(roomid);
                }

                battleRoom.update();

                // Send user to battle room
                return this.parse(`/join ${roomid}`);

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
