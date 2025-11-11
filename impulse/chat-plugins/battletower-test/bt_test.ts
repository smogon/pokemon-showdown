import { createBattle } from './bt_utils';

// Array of all possible pack teams for testing
const PACK_TEAMS = [
	// WHY AZUMARILL HAS FREEZE STATUS:
	// The 'frz' (freeze) status demonstrates the custom status condition feature, allowing
	// pokemon to start with status conditions for testing status-related abilities and moves.
	//
	// TEAM FORMAT EXPLANATION:
	// The packed team string format is: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level|happiness,misc
	// The misc section contains: hpType,pokeball,gigantamax,dynamaxLevel,teraType,hpPercentage,status,experience
	// - Position 6 in misc: hpPercentage (50 for Weavile = starts at 50% HP)
	// - Position 7 in misc: status (frz for Azumarill = starts frozen)
	// - Position 8 in misc: experience (for leveling tests)
	"Testmon1|Weavile|ChoiceBand|Pickpocket|IceShard,KnockOff,IcicleCrash,LowKick|Jolly|,252,,,4,252|M||||,,,,,,50,]Testmon2|Azumarill|ChoiceBand|HugePower|AquaJet,PlayRough,Waterfall,Superpower|Adamant|252,252,,,4,|M||||,,,,,,,frz",
];

// Teams for leveling system tests
const LEVEL_TEST_TEAMS = {
	// EXP test: Level 5 Charmander with only 2 moves vs Level 3 Pidgey
	// Charmander will gain EXP but not enough to level up
	exp: {
		player: "Charmander||Blaze|Scratch,Growl|Adamant||M|||||||135",
		opponent: "Pidgey||KeenEye|Tackle,SandAttack|Hardy||F||||||",
	},
	// Evolution test: Level 15 Charmander close to level 16 vs Level 12 Pidgey
	// Charmander will level up to 16 and evolve into Charmeleon
	evolution: {
		player: "Charmander||Blaze|Scratch,Ember,Smokescreen|Adamant||M|||15||||2450",
		opponent: "Pidgey||KeenEye|Tackle,SandAttack,Gust|Hardy||F||12|||",
	},
	// Move learning test: Level 6 Charmander vs Level 4 Pidgey
	// Charmander will level up to 7 and learn Ember
	moves: {
		player: "Charmander||Blaze|Scratch,Growl|Adamant||M||6||||165",
		opponent: "Pidgey||KeenEye|Tackle,SandAttack|Hardy||F||4|||",
	},
};

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

	btexp(
		this: ChatCommandContext,
		target: string,
		room: any,
		user: any
	) {
		const args = target.split(',').map(x => x.trim());
		if (args.length < 1) {
			return this.sendReply("Usage: /btexp [target user] - Test EXP gain system");
		}

		const targetUserId = args[0];
		const commandUser = user;
		const targetUser = Users.get(targetUserId);

		if (!commandUser || !targetUser) {
			return this.sendReply("Both users must be online.");
		}

		const battleRoom = createBattle({
			user: commandUser,
			botUserId: targetUserId,
			userTeam: LEVEL_TEST_TEAMS.exp.player,
			botTeam: LEVEL_TEST_TEAMS.exp.opponent,
			battleType: 'custom',
			format: 'gen9customgame',
			title: `EXP Test: ${commandUser.name} vs. ${targetUser.name}`,
		});

		if (!battleRoom) {
			return this.sendReply("Failed to create the battle.");
		}

		this.sendReply(`EXP Test battle created! Level 5 Charmander (135 EXP) vs Level 3 Pidgey.`);
		this.sendReply(`Expected: Charmander gains ~23 EXP after defeating Pidgey, reaching 158 EXP (needs 179 for level 6).`);
		this.sendReply(`Room: ${battleRoom.roomid}`);
	},

	btevo(
		this: ChatCommandContext,
		target: string,
		room: any,
		user: any
	) {
		const args = target.split(',').map(x => x.trim());
		if (args.length < 1) {
			return this.sendReply("Usage: /btevo [target user] - Test evolution system");
		}

		const targetUserId = args[0];
		const commandUser = user;
		const targetUser = Users.get(targetUserId);

		if (!commandUser || !targetUser) {
			return this.sendReply("Both users must be online.");
		}

		const battleRoom = createBattle({
			user: commandUser,
			botUserId: targetUserId,
			userTeam: LEVEL_TEST_TEAMS.evolution.player,
			botTeam: LEVEL_TEST_TEAMS.evolution.opponent,
			battleType: 'custom',
			format: 'gen9customgame',
			title: `Evolution Test: ${commandUser.name} vs. ${targetUser.name}`,
		});

		if (!battleRoom) {
			return this.sendReply("Failed to create the battle.");
		}

		this.sendReply(`Evolution Test battle created! Level 15 Charmander (2450 EXP) vs Level 12 Pidgey.`);
		this.sendReply(`Expected: Charmander levels up to 16 and evolves into Charmeleon with stat increases.`);
		this.sendReply(`Expected moves: Dragon Breath learned, Ember/Scratch/Smokescreen already known (skipped).`);
		this.sendReply(`Room: ${battleRoom.roomid}`);
	},

	btmoves(
		this: ChatCommandContext,
		target: string,
		room: any,
		user: any
	) {
		const args = target.split(',').map(x => x.trim());
		if (args.length < 1) {
			return this.sendReply("Usage: /btmoves [target user] - Test move learning system");
		}

		const targetUserId = args[0];
		const commandUser = user;
		const targetUser = Users.get(targetUserId);

		if (!commandUser || !targetUser) {
			return this.sendReply("Both users must be online.");
		}

		const battleRoom = createBattle({
			user: commandUser,
			botUserId: targetUserId,
			userTeam: LEVEL_TEST_TEAMS.moves.player,
			botTeam: LEVEL_TEST_TEAMS.moves.opponent,
			battleType: 'custom',
			format: 'gen9customgame',
			title: `Move Learning Test: ${commandUser.name} vs. ${targetUser.name}`,
		});

		if (!battleRoom) {
			return this.sendReply("Failed to create the battle.");
		}

		this.sendReply(`Move Learning Test battle created! Level 6 Charmander (165 EXP) vs Level 4 Pidgey.`);
		this.sendReply(`Expected: Charmander levels up to 7 and learns Ember (has < 4 moves).`);
		this.sendReply(`Room: ${battleRoom.roomid}`);
	},

	btall(
		this: ChatCommandContext,
		target: string,
		room: any,
		user: any
	) {
		const args = target.split(',').map(x => x.trim());
		if (args.length < 1) {
			return this.sendReply("Usage: /btall [target user] - Test all leveling systems (EXP, moves, evolution)");
		}

		const targetUserId = args[0];
		const commandUser = user;
		const targetUser = Users.get(targetUserId);

		if (!commandUser || !targetUser) {
			return this.sendReply("Both users must be online.");
		}

		// Run evolution test which includes EXP gain, level up, move learning, and evolution
		const battleRoom = createBattle({
			user: commandUser,
			botUserId: targetUserId,
			userTeam: LEVEL_TEST_TEAMS.evolution.player,
			botTeam: LEVEL_TEST_TEAMS.evolution.opponent,
			battleType: 'custom',
			format: 'gen9customgame',
			title: `Full Leveling Test: ${commandUser.name} vs. ${targetUser.name}`,
		});

		if (!battleRoom) {
			return this.sendReply("Failed to create the battle.");
		}

		this.sendReply(`=== Full Leveling System Test ===`);
		this.sendReply(`Battle created: Level 15 Charmander (2450 EXP) vs Level 12 Pidgey`);
		this.sendReply(`This test demonstrates:`);
		this.sendReply(`1. EXP Gain: Charmander gains ~98 EXP from defeating Pidgey`);
		this.sendReply(`2. Level Up: Charmander levels from 15 → 16`);
		this.sendReply(`3. Stat Recalculation: HP 41→49, ATK 27→33, SPA 24→31, SPE 29→35`);
		this.sendReply(`4. Evolution: Charmander → Charmeleon (evolves at level 16)`);
		this.sendReply(`5. Move Learning: Dragon Breath learned, duplicates skipped`);
		this.sendReply(`Room: ${battleRoom.roomid}`);
	},

	bthelp(
		this: ChatCommandContext
	) {
		this.sendReply(`=== Battle Tower Test Commands ===`);
		this.sendReply(`/bt [user] - Create a standard battle with random teams`);
		this.sendReply(`/btexp [user] - Test EXP gain system (no level up)`);
		this.sendReply(`/btmoves [user] - Test move learning on level up`);
		this.sendReply(`/btevo [user] - Test evolution system with level up`);
		this.sendReply(`/btall [user] - Test all leveling features (recommended)`);
		this.sendReply(`/bthelp - Show this help message`);
	},
};
