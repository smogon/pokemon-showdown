export class NPC extends User {
    isNPC: boolean;

    constructor(name: string, group: string) {
        // Create a unique ID for the NPC
        const npcId = `npc-${toID(name)}` as ID;
        super({
            id: npcId,
            name: name,
            group: group,
        });
        
        this.isNPC = true;
        this.connected = true;
        this.locked = false;
        this.autoconfirmed = true;
        this.trusted = name;
    }

    // Override necessary User methods
    tryJoinRoom(room: Room, connection: Connection | null) {
        return Rooms.get(room)?.onJoin(this, null as any);
    }

    leaveRoom(room: Room) {
        room.onLeave(this);
    }

    // Add AI decision making methods here
    async makeMove(battle: Room) {
        // Implement AI logic to choose moves
        // This is where you'd put your AI battle logic
        const moves = battle.battle?.moves || [];
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        
        if (randomMove) {
            battle.battle?.makeMove(this, randomMove);
        }
    }
}
