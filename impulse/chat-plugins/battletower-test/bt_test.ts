import { createBattle } from './bt_utils';

// Array of all possible pack teams for testing
const PACK_TEAMS = [
	// Team 1: Stall team (Blissey + Umbreon with status conditions)
	"Testmon1|Blissey|Leftovers|NaturalCure|SoftBoiled,SeismicToss,ThunderWave,HealBell|Bold|252,,252,,4,|F||||,,,,,,33,brn]Testmon2|Umbreon|Leftovers|Synchronize|Wish,Protect,FoulPlay,Toxic|Careful|252,,4,,252,|M||||,,,,,,50,psn",

	// Team 3: Balanced team (Ferrothorn + Toxapex with low HP)
	"Testmon1|Ferrothorn|Leftovers|IronBarbs|StealthRock,LeechSeed,PowerWhip,KnockOff|Relaxed|252,,252,,,|M||||,,,,,,60,brn]Testmon2|Toxapex|BlackSludge|Regenerator|Scald,Toxic,Recover,Haze|Bold|252,,,252,4,|F||||,,,,,,25,",

	// Team 5: Trick Room team (Conkeldurr + Mimikyu with paralysis)
	"Testmon1|Conkeldurr|FlameOrb|Guts|DrainPunch,MachPunch,KnockOff,StoneEdge|Brave|252,252,,,4,|M|,,,,,0|||,,,,,,80,brn]Testmon2|Mimikyu|LifeOrb|Disguise|SwordsDance,PlayRough,ShadowSneak,ShadowClaw|Adamant|,252,,,4,252|F||||,,,,,,,par",

	// Team 7: Rain team (Pelipper + Barraskewda with toxic)
	"Testmon1|Pelipper|DampRock|Drizzle|HydroPump,Hurricane,Uturn,Roost|Modest|248,,,252,,8|M||||,,,,,,56,slp]Testmon2|Barraskewda|LifeOrb|SwiftSwim|Liquidation,CloseCombat,Crunch,AquaJet|Adamant|,252,,,4,252|M||||,,,,,,,tox",

	// Team 10: Hyper offense (Weavile + Azumarill with freeze status)
	"Testmon1|Weavile|ChoiceBand|Pickpocket|IceShard,KnockOff,IcicleCrash,LowKick|Jolly|,252,,,4,252|M||||]Testmon2|Azumarill|ChoiceBand|HugePower|AquaJet,PlayRough,Waterfall,Superpower|Adamant|252,252,,,4,|M||||,,,,,,,frz",
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
