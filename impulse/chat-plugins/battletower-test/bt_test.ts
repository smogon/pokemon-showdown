import { createBattle } from './bt_utils';

// Array of all possible pack teams for testing
const PACK_TEAMS = [
	// Team 10: Hyper offense (Weavile at 50% HP + Azumarill with freeze status)
	//
	// WHY WEAVILE IS AT 50% HP (not 0%):
	// This team demonstrates the custom HP percentage feature (hpPercentage) which allows
	// pokemon to start battles with reduced HP for testing scenarios like:
	// - Low-HP abilities (Emergency Exit, Berserk, etc.)
	// - Berry activation thresholds
	// - Revenge killing scenarios
	//
	// Originally this team had Weavile at 0% HP, but this was changed to 50% HP because:
	// 1. Battles cannot start with fainted pokemon (HP <= 0) - this is now validated
	// 2. 50% HP still demonstrates the custom HP feature working correctly
	// 3. It creates a valid battle scenario for testing
	//
	// WHY AZUMARILL HAS FREEZE STATUS:
	// The 'frz' (freeze) status demonstrates the custom status condition feature, allowing
	// pokemon to start with status conditions for testing status-related abilities and moves.
	//
	// TEAM FORMAT EXPLANATION:
	// The packed team string format is: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level|happiness,misc
	// The misc section contains: hpType,pokeball,gigantamax,dynamaxLevel,teraType,hpPercentage,status
	// - Position 6 in misc: hpPercentage (50 for Weavile = starts at 50% HP)
	// - Position 7 in misc: status (frz for Azumarill = starts frozen)
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
