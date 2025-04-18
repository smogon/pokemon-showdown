/**
 * Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows users to battle against a server-controlled AI opponent.
 */

import type {Battle} from '../sim/battle';
import {BattleStream} from '../sim/battle-stream';

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
                const formatId = 'gen9randombattle';
                const format = Dex.formats.get(formatId);
                
                if (!format.exists) {
                    throw new Chat.ErrorMessage(`Invalid format: ${formatId}`);
                }

                // Generate teams
                const generator = Teams.getGenerator(formatId);
                const p1team = Teams.pack(generator.getTeam());
                const p2team = Teams.pack(generator.getTeam());

                // Create battle
                const players: [Player, Player] = [
                    {
                        name: user.name,
                        avatar: user.avatar,
                        team: p1team,
                    },
                    {
                        name: "Server",
                        avatar: "1",
                        team: p2team,
                    },
                ];

                const roomid = `battle-${formatId}-${Date.now()}`;
                const battle = await Rooms.createBattle({
                    format: formatId,
                    roomid,
                    players,
                    rated: false,
                    p1: {name: user.name, userid: user.id},
                    p2: {name: "Server", userid: "server"},
                });

                if (!battle || !battle.room) {
                    throw new Chat.ErrorMessage(`Failed to create battle room.`);
                }

                // Initialize server AI
                const serverAI = new ServerAI();

                // Set up battle listeners for server's turns
                battle.stream.on('message', (chunk: string) => {
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('|request|')) {
                            try {
                                const request = JSON.parse(line.slice(9));
                                if (request.side?.id === 'p2') { // Server's turn
                                    const decision = serverAI.makeDecision(battle, 1);
                                    if (decision) {
                                        void battle.makeChoices('default', decision);
                                    }
                                }
                            } catch (e) {
                                console.error('Error handling battle request:', e);
                            }
                        }
                    }
                });

                // Join the user to the battle
                user.joinRoom(battle.room);
                
                battle.room.update();
                
                return this.parse(`/join ${battle.roomid}`);

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

// Add types for TypeScript
interface Player {
    name: string;
    avatar: string | number;
    team: string;
}
