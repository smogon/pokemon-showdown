import type {User} from './users';
import {RoomGame} from './room-game';
import type {GameRoom} from './rooms';

interface BattleTowerState {
    level: number;
    wins: number;
    streak: number;
    currentBattle: string | null;
}

export class BattleTower extends RoomGame {
    readonly playerStates: Map<string, BattleTowerState>;
    readonly format: string;

    constructor(room: GameRoom) {
        super(room);
        this.playerStates = new Map();
        this.format = 'gen9randombattle'; // Using random battles for testing
        this.room.title = `Battle Tower`;
    }

    async startChallenge(user: User) {
        if (!user.connected) return false;
        
        const state = this.getPlayerState(user);
        if (state.currentBattle) {
            user.popup(`You already have an active battle in the tower!`);
            return false;
        }

        // Create battle room
        const roomid = `tower-${user.id}`;
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

        state.currentBattle = roomid;
        this.updateDisplay();
        return true;
    }

    onBattleEnd(winner: User | null, roomid: string) {
        for (const [userid, state] of this.playerStates) {
            if (state.currentBattle === roomid) {
                const user = Users.get(userid);
                if (!user) continue;

                if (winner?.id === userid) {
                    state.wins++;
                    state.streak++;
                    if (state.streak > 0 && state.streak % 3 === 0) {
                        state.level++;
                        this.room.add(`|raw|<div class="broadcast-green">Congratulations ${user.name}! You've reached Level ${state.level}!</div>`);
                    }
                } else {
                    state.streak = 0;
                }
                state.currentBattle = null;
                break;
            }
        }
        this.updateDisplay();
    }

    private getPlayerState(user: User): BattleTowerState {
        let state = this.playerStates.get(user.id);
        if (!state) {
            state = {
                level: 1,
                wins: 0,
                streak: 0,
                currentBattle: null
            };
            this.playerStates.set(user.id, state);
        }
        return state;
    }

    updateDisplay() {
        let buf = `|uhtml|battletower|<div class="infobox"><center><h3>Battle Tower Rankings</h3></center><hr />`;
        const rankings = [...this.playerStates.entries()]
            .sort(([,a], [,b]) => b.level - a.level || b.wins - a.wins);

        for (const [userid, state] of rankings) {
            const user = Users.get(userid);
            if (!user) continue;
            buf += `<strong>${user.name}</strong> - Level ${state.level} (${state.wins} wins, ${state.streak} streak)`;
            if (state.currentBattle) buf += ` - <em>In Battle</em>`;
            buf += `<br />`;
        }
        buf += `</div>`;
        this.room.add(buf).update();
    }

    destroy() {
        // Clean up any active battles
        for (const [userid, state] of this.playerStates) {
            if (state.currentBattle) {
                const battle = Rooms.get(state.currentBattle);
                if (battle?.battle) battle.battle.destroy();
            }
        }
        super.destroy();
    }
}
