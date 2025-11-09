import { createBattle } from './bt_utils';

// Array of all possible pack teams for testing
const PACK_TEAMS = [
	// Team 10: Hyper offense (Weavile + Azumarill with freeze status)
	"Testmon1|Weavile|ChoiceBand|Pickpocket|IceShard,KnockOff,IcicleCrash,LowKick|Jolly|,252,,,4,252|M||||,,,,,,0,]Testmon2|Azumarill|ChoiceBand|HugePower|AquaJet,PlayRough,Waterfall,Superpower|Adamant|252,252,,,4,|M||||,,,,,,,frz",
];

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
		// Randomly select one of the pack teams
		const teamPacked = PACK_TEAMS[Math.floor(Math.random() * PACK_TEAMS.length)];

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
	},
};
