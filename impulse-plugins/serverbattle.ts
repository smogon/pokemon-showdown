/**
 * Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows users to battle against a server-controlled AI opponent.
 * 
 * @author musaddiktemkar
 */

import {ServerAI} from './serverbattle/ai';
import type {Battle} from '../sim/battle';

interface ServerBattleSettings {
    format: string;
    allowedFormats: string[];
    aiDifficulty: 'easy' | 'medium' | 'hard';
}

export class ServerBattleManager {
    private settings: ServerBattleSettings = {
        format: 'gen9randombattle',
        allowedFormats: ['gen9randombattle'],
        aiDifficulty: 'easy',
    };

    private battles: Map<string, Battle> = new Map();
    private readonly ai: ServerAI;

    constructor() {
        this.ai = new ServerAI();
    }

    async createBattle(user: User): Promise<string> {
        // Create battle options
        const options = {
            formatid: this.settings.format,
            rated: false,
        };

        // Create battle room
        const roomid = Rooms.global.prepBattleRoom(this.settings.format);
        const room = Rooms.global.addRoom({
            title: `${user.name} vs. Server`,
            type: 'battle',
            id: roomid,
            ...options,
        }, true);

        if (!room) throw new Chat.ErrorMessage(`Failed to create battle room.`);

        // Set up players
        const p1 = user;
        const p2spec = {
            name: "Server",
            avatar: "1",
        };

        const battle = Rooms.createBattle({
            format: this.settings.format,
            roomid: roomid,
            players: [p1.name, p2spec.name],
            playerids: [p1.id, 'server'],
            rated: false,
        });

        if (!battle) throw new Chat.ErrorMessage(`Failed to create battle.`);

        // Store battle reference
        this.battles.set(roomid, battle);

        // Set up AI handler
        battle.onEvent('request', (request, side) => {
            if (side.id === 'p2') { // Server's turn
                const decision = this.ai.makeDecision(battle, 1);
                void this.executeDecision(battle, decision);
            }
        });

        // Join user to room
        p1.joinRoom(room);

        return roomid;
    }

    private async executeDecision(battle: Battle, decision: string) {
        if (!decision) return;
        battle.makeChoices('default', decision);
    }

    endBattle(roomid: string) {
        this.battles.delete(roomid);
    }
}

export const ServerBattle = new ServerBattleManager();

export const commands: Chat.ChatCommands = {
    serverbattle: 'battleserver',
    battleserver: {
        async ''(target, room, user) {
            if (!this.canTalk()) return;
            
            try {
                const roomid = await ServerBattle.createBattle(user);
                return this.parse(`/join ${roomid}`);
            } catch (e) {
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
