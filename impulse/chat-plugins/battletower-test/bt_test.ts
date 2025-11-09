import { createBattle } from './bt_utils';

export const commands: Chat.ChatCommands = {
  bt(
        this: ChatCommandContext,
        target: string,
        room: any,
        user: any
    ) {
        const args = target.split(',').map(x => x.trim());
        if (args.length < 1) {
            return this.sendReply("Usage: /bt [target user]");
        }

        const targetUserId = args[0];
        const teamPacked = "Testmon1|Blissey|Leftovers|NaturalCure|SoftBoiled,SeismicToss,ThunderWave,HealBell|Bold|252,,252,,,4,|F||| |100||||,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|33,brn]Testmon2|Umbreon|Leftovers|Synchronize|Wish,Protect,FoulPlay,Toxic|Careful|252,,4,,,252,|M||| |100||||,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|,,|50,psn";

        const commandUser = user;
        const targetUser = Users.get(targetUserId);

        if (!commandUser || !targetUser) {
            return this.sendReply("Both users must be online.");
        }

        const battleRoom = createBattle({
            user: commandUser,
            botUserId: targetUserId,
            userTeam: teamPacked,
            botTeam: teamPacked,
            battleType: 'custom',
            format: 'gen9customgame',
            title: `${commandUser.name} vs. ${targetUser.name}`,
        });

        if (!battleRoom) {
            return this.sendReply("Failed to create the battle.");
        }

        this.sendReply(`Battle created in room: ${battleRoom.roomid}`);
    }
};
