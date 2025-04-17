import type {User} from './users';
import type {RoomGame} from './room-game';
import type {GameRoom} from './rooms';

interface BattleTowerState {
    level: number;
    wins: number;
    streak: number;
    currentBattleId: string | null;
}

export class BattleTower {
    room: GameRoom; 
    playerStates: Map<string, BattleTowerState>;
    format: string;

    constructor(room: GameRoom) {
        this.room = room;
        this.playerStates = new Map();
        this.format = 'gen9randombattle'; // Using random battles for testing
        
        // Register our battle end handler
        Chat.addPlugin({
            onBattleEnd: (battle: RoomGame, winnerid: string, playerids: string[]) => {
                if (!battle.room.roomid.startsWith('tower-')) return;
                this.onBattleEnd(winnerid);
            }
        });

        this.room.title = `Battle Tower`;
        this.room.add(
            `|raw|<div class="broadcast-blue"><h2>Welcome to the Battle Tower!</h2>` +
            `Use /tower challenge to start climbing.<br />` +
            `Win streaks will increase your level and face tougher opponents.</div>`
        ).update();
    }

    getPlayerState(userid: string): BattleTowerState {
        let state = this.playerStates.get(userid);
        if (!state) {
            state = {
                level: 1,
                wins: 0,
                streak: 0,
                currentBattleId: null
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

        // Create battle room
        const roomid = `tower-${user.id}`;
        const room = await Rooms.createBattle({
            format: this.format,
            isPrivate: false,
            roomid: roomid,
            challengeType: 'challenge',
            players: [{user: user}, {user: null, team: ''}], // AI opponent handled by sim
            rated: false,
            tour: null
        });

        if (!room) {
            user.popup(`Failed to create battle.`);
            return false;
        }

        state.currentBattleId = roomid;
        this.updateDisplay();
        return true;
    }

    onBattleEnd(winnerid: string) {
        const state = this.playerStates.get(winnerid);
        if (!state) return;

        if (state.currentBattleId) {
            state.wins++;
            state.streak++;
            if (state.streak > 0 && state.streak % 3 === 0) {
                state.level++;
                const user = Users.get(winnerid);
                if (user) {
                    this.room.add(
                        `|raw|<div class="broadcast-green">Congratulations ${user.name}! ` +
                        `You've reached Level ${state.level} in the Battle Tower!</div>`
                    ).update();
                }
            }
        }
        
        state.currentBattleId = null;
        this.updateDisplay();
    }

    updateDisplay() {
        let buf = `|uhtmlchange|battletower|<div class="infobox"><center><h3>Battle Tower Rankings</h3></center><hr />`;
        
        // Sort players by level and wins
        const rankings = [...this.playerStates.entries()]
            .sort(([,a], [,b]) => b.level - a.level || b.wins - a.wins);

        for (const [userid, state] of rankings) {
            const user = Users.get(userid);
            if (!user) continue;
            buf += `<strong>${user.name}</strong> - Level ${state.level} (${state.wins} wins, ${state.streak} streak)`;
            if (state.currentBattleId) buf += ` - <em>In Battle</em>`;
            buf += `<br />`;
        }
        buf += `</div>`;
        
        this.room.add(buf).update();
    }

    destroy() {
        // Clean up any active battles
        for (const [userid, state] of this.playerStates) {
            if (state.currentBattleId) {
                const battle = Rooms.get(state.currentBattleId);
                if (battle?.battle) battle.battle.destroy();
            }
        }

        // Remove our battle end handler
        // Chat.removePlugin(this); // Uncomment if you implement plugin removal
    }
}
