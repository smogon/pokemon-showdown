/**
 * Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows users to battle against a server-controlled AI opponent.
 */

import type {Battle} from '../sim/battle';

export class ServerAI {
    makeDecision(battle: Battle, serverSide: number): string {
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
    }
}

export const commands: Chat.ChatCommands = {
    serverbattle: 'battleserver',
    battleserver: {
        async ''(target, room, user) {
            if (!this.canTalk()) return;
            
            // Default to random battle format
            const format = 'gen9randombattle';
            
            // Create the battle room
            const battle = await Rooms.createBattle({
                format: format,
                players: [{name: user.name, user: user}, {name: 'Server', user: null}],
                rated: false,
                challengeType: 'challenge',
            });

            if (!battle) throw new Chat.ErrorMessage(`Failed to create battle.`);

            // Initialize server AI
            const serverAI = new ServerAI();
            
            // Set up battle listeners
            battle.stream.write(`>start {"formatid":"${format}"}`);
            battle.stream.write(`>player p1 ${JSON.stringify({name: user.name, avatar: user.avatar})}`);
            battle.stream.write(`>player p2 ${JSON.stringify({name: "Server", avatar: 1})}`);

            // Handle server's turns
            battle.stream.on('message', (chunk: string) => {
                const parts = chunk.split('\n');
                for (const part of parts) {
                    if (part.startsWith('|request|')) {
                        try {
                            const request = JSON.parse(part.slice(9));
                            if (request.side.id === 'p2') { // Server's turn
                                const decision = serverAI.makeDecision(battle, 1);
                                if (decision) {
                                    void battle.makeChoices('default', decision);
                                }
                            }
                        } catch (e) {
                            // Handle JSON parse error
                            console.error('Error parsing request:', e);
                        }
                    }
                }
            });

            // Join the user to the battle room
            user.joinRoom(battle.room);
            
            return this.parse(`/join ${battle.roomid}`);
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
