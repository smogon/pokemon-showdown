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
        const teamPacked = "Charizard||leftovers|blaze|flamethrower,airslash,solarbeam,dragonclaw|timid|,0,,252,4,252|M|,,,,,|S|||100|60|psn|,,,,]Blastoise||sitrusberry|torrent|hydropump,icebeam,darkpulse,rapidspin|modest|252,,,252,4,0|M|,,,,,|S|||100|90|par|,,,,]Venusaur||blacksludge|overgrow|gigadrain,sludgebomb,synthesis,leechseed|bold|252,,,252,4,0|F|,,,,,|S|||100|40|slp|,,,,]Pikachu||lightball|static|volttackle,irontail,grassknot,quickattack|jolly|,252,,4,,252|M|,,,,,|S|||100|||,,,,]Gengar||focussash|cursedbody|shadowball,sludgewave,focusblast,destinybond|timid|,0,,252,4,252|F|,,,,,|S|||100|||frz|,,,,";

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
