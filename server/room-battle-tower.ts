/**
 * Pokemon Showdown - Battle Tower Game System
 * Created by impulseserver on 2025-04-17 18:24:45 UTC
 * 
 * Implements a battle tower system where players can challenge
 * increasingly difficult opponents as they climb levels through wins.
 */

import type {User} from './users';
import type {GameRoom} from './rooms';
import {RoomGame} from './room-game';

interface BattleTowerState {
    level: number;
    wins: number;
    streak: number;
    currentBattleId: string | null;
    lastBattleTime: number;
}

export class BattleTower extends RoomGame {
    declare readonly gameid: ID;
    declare readonly room: GameRoom;
    playerStates: Map<ID, BattleTowerState>;
    format: string;

    constructor(room: GameRoom) {
        super(room);
        this.gameid = 'battletower' as ID;
        this.playerStates = new Map();
        this.format = 'gen9randombattle'; // Using random battles for testing
        this.title = 'Battle Tower';

        // Register battle end handler
        Chat.plugins.battletower = {
            onBattleEnd: (battle: RoomGame, winnerid: string, playerids: string[]) => {
                if (!battle.room.roomid.startsWith('tower-')) return;
                this.onBattleEnd(winnerid);
            }
        };

        this.init();
    }

    init() {
        // Display welcome message and instructions
        this.room.add(
            `|html|<div class="broadcast-blue"><h2>Welcome to the Battle Tower!</h2>` +
            `Test your skills against increasingly difficult opponents!<br /><br />` +
            `Commands:<br />` +
            `• /battletower challenge - Start a battle<br />` +
            `• /battletower records - View your progress<br /><br />` +
            `Rules:<br />` +
            `• Win 3 battles in a row to advance to the next level<br />` +
            `• Higher levels mean tougher opponents<br />` +
            `• 5 minute cooldown between challenges</div>`
        ).update();
        
        // Initialize the display
        this.updateDisplay();
    }

    getPlayerState(userid: ID): BattleTowerState {
        let state = this.playerStates.get(userid);
        if (!state) {
            state = {
                level: 1,
                wins: 0,
                streak: 0,
                currentBattleId: null,
                lastBattleTime: 0
            };
            this.playerStates.set(userid, state);
        }
        return state;
    }

    async startChallenge(user: User) {
        if (!user.connected) return false;
        
        const state = this.getPlayerState(user.id);
        if (state.currentBattleId) {
            user.popup(`You already have an active battle in the tower!`);
            return false;
        }

        // Check cooldown (5 minutes between challenges)
        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 minutes
        if (now - state.lastBattleTime < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - state.lastBattleTime)) / 1000);
            user.popup(`Please wait ${timeLeft} seconds before your next challenge.`);
            return false;
        }

        // Create battle room with unique ID
        const roomid = `tower-${user.id}-${Date.now()}`;
        const room = await Rooms.createBattle({
            format: this.format,
            isPrivate: false,
            roomid: roomid,
            challengeType: 'challenge',
            players: [{user: user}, {user: null, team: ''}],
            rated: false,
            tour: null
        });

        if (!room) {
            user.popup(`Failed to create battle.`);
            return false;
        }

        // Update player state
        state.currentBattleId = roomid;
        state.lastBattleTime = now;
        
        // Announce the challenge
        this.room.add(
            `|html|<div class="infobox"><strong>${user.name}</strong> has started a Level ${state.level} Battle Tower challenge!</div>`
        ).update();
        
        this.updateDisplay();
        return true;
    }

    onBattleEnd(winnerid: string) {
        const state = this.playerStates.get(winnerid as ID);
        if (!state) return;

        if (state.currentBattleId) {
            const user = Users.get(winnerid);
            state.wins++;
            state.streak++;
            
            // Level up every 3 wins
            if (state.streak > 0 && state.streak % 3 === 0) {
                state.level++;
                if (user) {
                    this.room.add(
                        `|html|<div class="broadcast-green"><strong>Congratulations ${user.name}!</strong><br />` +
                        `You've reached Level ${state.level} in the Battle Tower!<br />` +
                        `Current streak: ${state.streak} wins</div>`
                    ).update();
                }
            } else if (user) {
                // Regular win announcement
                this.room.add(
                    `|html|<div class="infobox">${user.name} won their Level ${state.level} battle!<br />` +
                    `Current streak: ${state.streak} wins</div>`
                ).update();
            }
        }
        
        state.currentBattleId = null;
        this.updateDisplay();
    }

    updateDisplay() {
        let buf = '|uhtmlchange|battletower|';
        buf += `<div class="infobox"><center><h3>Battle Tower Rankings</h3></center><hr />`;
        
        const rankings = [...this.playerStates.entries()]
            .sort(([,a], [,b]) => b.level - a.level || b.wins - a.wins)
            .slice(0, 50); // Show top 50 only

        if (rankings.length === 0) {
            buf += `<center><i>No challengers yet!</i></center>`;
        } else {
            buf += `<table style="margin:auto;text-align:center;border-spacing:2px">`;
            buf += `<tr><th style="padding:5px">Rank</th><th style="padding:5px">Player</th>`;
            buf += `<th style="padding:5px">Level</th><th style="padding:5px">Wins</th>`;
            buf += `<th style="padding:5px">Streak</th><th style="padding:5px">Status</th></tr>`;
            
            rankings.forEach(([userid, state], index) => {
                const user = Users.get(userid);
                if (!user) return;
                
                const bgColor = index === 0 ? '#FFD700' : // Gold for #1
                               index === 1 ? '#C0C0C0' : // Silver for #2
                               index === 2 ? '#CD7F32' : // Bronze for #3
                               index < 10 ? '#EFEFEF' : ''; // Light gray for top 10
                
                buf += `<tr style="background-color:${bgColor}">`;
                buf += `<td style="padding:5px">${index + 1}</td>`;
                buf += `<td style="padding:5px">${user.name}</td>`;
                buf += `<td style="padding:5px">${state.level}</td>`;
                buf += `<td style="padding:5px">${state.wins}</td>`;
                buf += `<td style="padding:5px">${state.streak}</td>`;
                buf += `<td style="padding:5px">`;
                if (state.currentBattleId) {
                    buf += `<em style="color:green">In Battle</em>`;
                } else {
                    const cooldownLeft = Math.ceil((5 * 60 * 1000 - (Date.now() - state.lastBattleTime)) / 1000);
                    if (cooldownLeft > 0) {
                        buf += `<em style="color:red">${Math.floor(cooldownLeft / 60)}:${String(cooldownLeft % 60).padStart(2, '0')}</em>`;
                    } else {
                        buf += `<em style="color:blue">Ready</em>`;
                    }
                }
                buf += `</td></tr>`;
            });
            buf += `</table>`;
        }
        buf += `</div>`;
        
        this.room.add(buf).update();
    }

    override destroy() {
        // Clean up any active battles
        for (const [userid, state] of this.playerStates) {
            if (state.currentBattleId) {
                const battle = Rooms.get(state.currentBattleId);
                if (battle?.battle) battle.battle.destroy();
            }
        }

        // Remove battle end handler
        if (Chat.plugins.battletower) {
            delete Chat.plugins.battletower;
        }

        // Clear data
        this.playerStates.clear();
        
        // Add final message
        this.room.add(`|html|<div class="broadcast-red"><strong>The Battle Tower has been closed!</strong></div>`).update();
        
        super.destroy();
    }
}
