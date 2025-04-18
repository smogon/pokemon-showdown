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
                const formatId = 'gen9randombattle';
                
                // Validate format
                const format = Dex.formats.get(formatId);
                if (!format.exists) {
                    throw new Chat.ErrorMessage(`Invalid format: ${formatId}`);
                }

                // Generate teams using the Teams API
                const generator = Teams.getGenerator(formatId);
                if (!generator) {
                    throw new Chat.ErrorMessage(`Failed to get team generator for format: ${formatId}`);
                }

                const p1team = generator.getTeam();
                const p2team = generator.getTeam();

                // Create the battle
                const battleRoom = await Rooms.createBattle({
                    format: format,
                    p1: {
                        userid: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        team: Teams.pack(p1team),
                    },
                    p2: {
                        userid: 'serverbot' as ID,
                        name: 'Server Bot',
                        avatar: '1',
                        team: Teams.pack(p2team),
                    },
                    rated: false,
                    challengeType: 'challenge',
                    tour: null,
                });

                if (!battleRoom) {
                    throw new Chat.ErrorMessage('Failed to create battle room.');
                }

                // Initialize server AI
                const serverAI = new ServerAI();

                // Set up AI response to battle requests
                if (battleRoom.battle) {
                    battleRoom.battle.stream.on('message', (chunk: string) => {
                        const lines = chunk.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('|request|')) {
                                try {
                                    const request = JSON.parse(line.slice(9));
                                    if (request.side?.id === 'p2') {
                                        const decision = serverAI.makeDecision(battleRoom.battle!, 1);
                                        if (decision) {
                                            void battleRoom.battle!.makeChoices('default', decision);
                                        }
                                    }
                                } catch (e) {
                                    console.error('Error handling battle request:', e);
                                }
                            }
                        }
                    });
                }

                // Add the user to the battle room
                if (!user.games.has(battleRoom.roomid)) {
                    user.games.add(battleRoom.roomid);
                }
                battleRoom.auth.set(user.id, Users.PLAYER_SYMBOL);

                // Send the user to the battle room
                this.parse(`/join ${battleRoom.roomid}`);

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
