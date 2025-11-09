import { createBattle } from './bt_utils';

// Array of all possible pack teams for testing
const PACK_TEAMS = [
	// Team 1: Stall team (Blissey + Umbreon with status conditions)
	"Testmon1|Blissey|Leftovers|NaturalCure|SoftBoiled,SeismicToss,ThunderWave,HealBell|Bold|252,,252,,4,|F||||,,,,,,33,brn]Testmon2|Umbreon|Leftovers|Synchronize|Wish,Protect,FoulPlay,Toxic|Careful|252,,4,,252,|M||||,,,,,,50,psn",

	// Team 2: Offensive team (Garchomp + Tapu Koko)
	"Testmon1|Garchomp|ChoiceScarf|RoughSkin|Outrage,Earthquake,StoneEdge,FireFang|Jolly|,252,,,4,252|M||||]Testmon2|TapuKoko|LifeOrb|ElectricSurge|Thunderbolt,DazzlingGleam,HiddenPower,Uturn|Timid|,,,252,4,252|||||",

	// Team 3: Balanced team (Ferrothorn + Toxapex with low HP)
	"Testmon1|Ferrothorn|Leftovers|IronBarbs|StealthRock,LeechSeed,PowerWhip,KnockOff|Relaxed|252,,252,,,|M||||]Testmon2|Toxapex|BlackSludge|Regenerator|Scald,Toxic,Recover,Haze|Bold|252,,,252,4,|F||||,,,,,,25,",

	// Team 4: Setup sweeper team (Dragonite + Volcarona)
	"Testmon1|Dragonite|WeaknessPolicy|Multiscale|DragonDance,Outrage,Earthquake,ExtremeSpeed|Adamant|,252,,,4,252|M||||]Testmon2|Volcarona|HeavyDutyBoots|FlameBody|QuiverDance,Flamethrower,BugBuzz,GigaDrain|Modest|,,,252,4,252|M||||",

	// Team 5: Trick Room team (Conkeldurr + Mimikyu with paralysis)
	"Testmon1|Conkeldurr|FlameOrb|Guts|DrainPunch,MachPunch,KnockOff,StoneEdge|Brave|252,252,,,4,|M|,,,,,0|||]Testmon2|Mimikyu|LifeOrb|Disguise|SwordsDance,PlayRough,ShadowSneak,ShadowClaw|Adamant|,252,,,4,252|F||||,,,,,,,par",

	// Team 6: Special attackers (Gengar + Alakazam)
	"Testmon1|Gengar|LifeOrb|CursedBody|ShadowBall,SludgeWave,FocusBlast,Taunt|Timid|,,,252,4,252|M||||]Testmon2|Alakazam|FocusSash|MagicGuard|Psychic,FocusBlast,ShadowBall,Encore|Timid|,,,252,4,252|M||||",

	// Team 7: Rain team (Pelipper + Barraskewda with toxic)
	"Testmon1|Pelipper|DampRock|Drizzle|HydroPump,Hurricane,Uturn,Roost|Modest|248,,,252,,8|M||||]Testmon2|Barraskewda|LifeOrb|SwiftSwim|Liquidation,CloseCombat,Crunch,AquaJet|Adamant|,252,,,4,252|M||||,,,,,,,tox",

	// Team 8: Physical walls (Skarmory + Hippowdon)
	"Testmon1|Skarmory|RockyHelmet|Sturdy|BraveBird,Roost,Whirlwind,StealthRock|Impish|252,,252,,4,|M||||]Testmon2|Hippowdon|Leftovers|SandStream|Earthquake,StealthRock,SlackOff,Toxic|Impish|252,,252,,4,|M||||",

	// Team 9: Speed control team (Excadrill + Tyranitar)
	"Testmon1|Excadrill|ChoiceScarf|SandRush|Earthquake,IronHead,RockSlide,RapidSpin|Jolly|,252,,,4,252|M||||]Testmon2|Tyranitar|ChoiceBand|SandStream|StoneEdge,Crunch,Earthquake,Pursuit|Adamant|,252,,,4,252|M||||",

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
