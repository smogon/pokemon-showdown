/*
* Pokemon Showdown
* Clans Wars Commands
*/
import {
	Clans,
	UserClans,
	ClanLogs,
	ClanBans,
	ClanPointsLogs,
	ClanWars,
	type ClanWarDoc,
	ClanBattleLogs,
} from './database';
import type {
	Clan,
	ClanPermissions,
	CustomClanRank,
	ClanStats,
	ClanWar,
} from './interface';
import { generateThemedTable } from
	'../../utils';
import { K_FACTOR, getExpectedScore, calculateElo, to,
	logClanActivity, hasClanPermission, generateWarCard } from './utils';

const LOBBY_ROOM_ID = 'lobby' as RoomID;

export const warCommands: Chat.ChatCommands = {
	// 1. War Lifecycle Management (Pending/Active)
	async challenge(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to challenge other clans.");
		}

		const [targetClanId, bestOfStr] = target.split(',').map(s => s.trim());
		const bestOf = parseInt(bestOfStr);

		if (!targetClanId) return this.errorReply("Specify a clan ID to challenge.");
		if (!bestOf) return this.errorReply("You must specify a 'Best of' number. Usage: /clan war challenge [clanid], [number]");
		if (bestOf < 1 || bestOf % 2 === 0) { // Must be an odd number
			return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		}
		if (bestOf > 101) return this.errorReply("'Best of' cannot be higher than 101.");

		const targetClan = await Clans.findOne({ _id: toID(targetClanId) });
		if (!targetClan) return this.errorReply(`Clan '${targetClanId}' not found.`);
		if (toID(targetClanId) === clanId) return this.errorReply("You cannot challenge your own clan.");

		// Check for 24 hour cooldown
		const lastChallenge = myClan.stats.lastWarChallenge || 0;
		const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		const timeSinceLastChallenge = Date.now() - lastChallenge;

		if (timeSinceLastChallenge < cooldownTime) {
			const timeRemaining = cooldownTime - timeSinceLastChallenge;
			const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
			return this.errorReply(`Your clan must wait ${hoursRemaining} more hour(s) before challenging another clan. (24 hour cooldown)`);
		}

		// Check if either clan already has an active or pending war
		const [myClanExistingWar, targetClanExistingWar] = await Promise.all([
			ClanWars.findOne({
				clans: clanId,
				status: { $in: ['pending', 'active'] },
			}),
			ClanWars.findOne({
				clans: toID(targetClanId),
				status: { $in: ['pending', 'active'] },
			}),
		]);

		if (myClanExistingWar) {
			const opponentId = myClanExistingWar.clans[0] === clanId ? myClanExistingWar.clans[1] : myClanExistingWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			return this.errorReply(`Your clan is already in a ${myClanExistingWar.status} war with ${opponent?.name || opponentId}.`);
		}

		if (targetClanExistingWar) {
			const opponentId = targetClanExistingWar.clans[0] === toID(targetClanId) ? targetClanExistingWar.clans[1] : targetClanExistingWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			return this.errorReply(`${targetClan.name} is already in a ${targetClanExistingWar.status} war with ${opponent?.name || opponentId}.`);
		}

		// Update last war challenge timestamp
		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { 'stats.lastWarChallenge': Date.now() } }
		);

		const newWar: Omit<ClanWar, '_id'> = {
			clans: [clanId, toID(targetClanId)],
			scores: { [clanId]: 0, [toID(targetClanId)]: 0 },
			status: 'pending',
			startDate: Date.now(),
			bestOf,
		};
		const insertResult = await ClanWars.insertOne(newWar as ClanWarDoc);
		const warId = insertResult.insertedId;
		if (!warId) {
			this.errorReply("There was an error creating the war document. Aborting.");
			return;
		}
		const war = await ClanWars.findOne({ _id: warId });
		if (!war) {
			this.errorReply("Failed to fetch the newly created war. Aborting.");
			return;
		}

		this.sendReply(`You have challenged ${targetClan.name} to a Best of ${bestOf} Pokémon War!`);

		const uhtmlId = `clan-war-card-${war._id}`;
		const challengerHtml = generateWarCard(war, myClan, targetClan, 'challenger');
		const targetHtml = generateWarCard(war, myClan, targetClan, 'target');
		const publicHtml = generateWarCard(war, myClan, targetClan, 'public');

		const targetRoom = Rooms.get(targetClan.chatRoom);
		const myRoom = Rooms.get(myClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (targetRoom) {
			targetRoom.add(`|uhtml|${uhtmlId}|${targetHtml}`).update();
		} else {
			this.errorReply(`Your challenge was sent, but I could not find the target clan's chat room ('${targetClan.chatRoom}') to post the challenge card. It may be inactive.`);
		}
		if (myRoom) {
			myRoom.add(`|uhtml|${uhtmlId}|${challengerHtml}`).update();
		} else {
			this.errorReply(`Your challenge was sent, but I could not find your clan's chat room ('${myClan.chatRoom}') to post the challenge card. It may be inactive.`);
		}
		if (lobbyRoom) {
			lobbyRoom.add(`|uhtml|${uhtmlId}|${publicHtml}`).update();
		}
	},

	async accept(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf; // This is the target clan (clan2)
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to accept war challenges.");
		}

		const targetClanId = toID(target); // This is the challenger clan (clan1)
		if (!targetClanId) return this.errorReply("Specify a clan ID to accept a challenge from.");

		const war = await ClanWars.findOne({
			clans: [targetClanId, clanId], // [challenger, target]
			status: 'pending',
		});

		if (!war) {
			return this.errorReply(`You do not have a pending war challenge from '${targetClanId}'.`);
		}

		// Check if either clan already has another active war
		const [myClanActiveWar, targetClanActiveWar] = await Promise.all([
			ClanWars.findOne({
				clans: clanId,
				status: 'active',
			}),
			ClanWars.findOne({
				clans: targetClanId,
				status: 'active',
			}),
		]);

		if (myClanActiveWar) {
			const opponentId = myClanActiveWar.clans[0] === clanId ? myClanActiveWar.clans[1] : myClanActiveWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			return this.errorReply(`Your clan is already in an active war with ${opponent?.name || opponentId}. Complete or end that war first.`);
		}

		if (targetClanActiveWar) {
			const opponentId = targetClanActiveWar.clans[0] === targetClanId ? targetClanActiveWar.clans[1] : targetClanActiveWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			const targetClan = await Clans.findOne({ _id: targetClanId });
			return this.errorReply(`${targetClan?.name || targetClanId} is already in an active war with ${opponent?.name || opponentId}.`);
		}

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { status: 'active', startDate: Date.now() } }
		);

		const updatedWar = await ClanWars.findOne({ _id: war._id });
		if (!updatedWar) return this.errorReply("Failed to fetch updated war data.");

		const [challengerClan, targetClan] = await Promise.all([
			Clans.findOne({ _id: updatedWar.clans[0] }), // clan1
			Clans.findOne({ _id: updatedWar.clans[1] }), // clan2
		]);

		if (!challengerClan || !targetClan) return this.errorReply("One of the war clans no longer exists.");

		const uhtmlId = `clan-war-card-${updatedWar._id}`;
		const challengerHtml = generateWarCard(updatedWar, challengerClan, targetClan, 'challenger');
		const targetHtml = generateWarCard(updatedWar, challengerClan, targetClan, 'target');
		const publicHtml = generateWarCard(updatedWar, challengerClan, targetClan, 'public');

		const challengerRoom = Rooms.get(challengerClan.chatRoom);
		const targetRoom = Rooms.get(targetClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (challengerRoom) challengerRoom.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
		if (targetRoom) targetRoom.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();
	},

	async deny(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf; // This is the target clan (clan2)
		if (!clanId) return this.errorReply("You are not in a clan.");
		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to deny war challenges.");
		}
		const challengerClanId = toID(target); // This is the challenger clan (clan1)
		if (!challengerClanId) return this.errorReply("Specify a clan ID to deny.");

		const war = await ClanWars.findOne({
			clans: { $all: [challengerClanId, clanId] },
			status: 'pending',
		});
		if (!war) return this.errorReply(`No pending challenge found between your clan and '${challengerClanId}'.`);

		const challengerClan = await Clans.findOne({ _id: challengerClanId });
		if (!challengerClan) return this.errorReply("Challenging clan not found.");
		
		const uhtmlId = `clan-war-card-${war._id}`;
		
		try {
			await ClanWars.deleteOne({ _id: war._id });
			
			await Clans.updateOne(
				{ _id: challengerClanId },
				{ $set: { 'stats.lastWarChallenge': 0 } }
			);
		} catch (e) {
			this.errorReply("An error occurred while declining the challenge.");
			return;
		}

		this.sendReply(`You have declined the war challenge from ${challengerClan.name}.`);

		const endMessage = `${myClan.name} has refused the war challenge from ${challengerClan.name}.`;
		// 'ended' perspective does not need clan-specific views
		const endedHtml = generateWarCard(war, challengerClan, myClan, 'ended', { endMessage });

		const challengerRoom = Rooms.get(challengerClan.chatRoom);
		const myRoom = Rooms.get(myClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (challengerRoom) {
			challengerRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
		if (myRoom) {
			myRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
		if (lobbyRoom) {
			lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
	},

	async cancel(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf; // This is the challenger clan (clan1)
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}

		const targetClanId = toID(target); // This is the target clan (clan2)
		if (!targetClanId) return this.errorReply("Specify the clan ID. Usage: /clan war cancel [clanid]");

		const war = await ClanWars.findOne({
			clans: [clanId, targetClanId],
			status: 'pending',
		});

		if (!war) {
			return this.errorReply(`No pending war challenge found with '${targetClanId}'.`);
		}

		// Only the challenger (first clan in array) can cancel
		if (war.clans[0] !== clanId) {
			return this.errorReply("Only the challenging clan can cancel a pending war.");
		}

		const targetClan = await Clans.findOne({ _id: targetClanId });
		if (!targetClan) return this.errorReply(`Clan '${targetClanId}' not found.`);

		const uhtmlId = `clan-war-card-${war._id}`;

		try {
			await ClanWars.deleteOne({ _id: war._id });

			await Clans.updateOne(
				{ _id: clanId },
				{ $set: { 'stats.lastWarChallenge': 0 } }
			);
		} catch (e) {
			this.errorReply("An error occurred while cancelling the challenge.");
			return;
		}

		this.sendReply(`You have withdrawn your war challenge to ${targetClan.name}.`);
		
		const endMessage = `${myClan.name} has withdrawn their war challenge to ${targetClan.name}.`;
		// 'ended' perspective does not need clan-specific views
		const endedHtml = generateWarCard(war, myClan, targetClan, 'ended', { endMessage });

		const targetRoom = Rooms.get(targetClan.chatRoom);
		const myRoom = Rooms.get(myClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (targetRoom) {
			targetRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
		if (myRoom) {
			myRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
		if (lobbyRoom) {
			lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		}
	},

	async rematch(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to challenge other clans.");
		}

		const [targetClanId, bestOfStr] = target.split(',').map(s => s.trim());
		const bestOf = parseInt(bestOfStr);

		if (!targetClanId) return this.errorReply("Specify a clan ID. Usage: /clan war rematch [clanid], [bestof]");
		if (!bestOf) return this.errorReply("You must specify a 'Best of' number.");
		if (bestOf < 1 || bestOf % 2 === 0) {
			return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		}
		if (bestOf > 101) return this.errorReply("'Best of' cannot be higher than 101.");

		const targetClan = await Clans.findOne({ _id: toID(targetClanId) });
		if (!targetClan) return this.errorReply(`Clan '${targetClanId}' not found.`);
		if (toID(targetClanId) === clanId) return this.errorReply("You cannot challenge your own clan.");

		// Check if they have war history
		const previousWar = await ClanWars.findOne({
			clans: { $all: [clanId, toID(targetClanId)] },
			status: 'completed',
		});

		if (!previousWar) {
			return this.errorReply(`You have no war history with ${targetClan.name}. Use /clan war challenge instead.`);
		}

		// Check if either clan already has an active or pending war
		const [myClanExistingWar, targetClanExistingWar] = await Promise.all([
			ClanWars.findOne({
				clans: clanId,
				status: { $in: ['pending', 'active'] },
			}),
			ClanWars.findOne({
				clans: toID(targetClanId),
				status: { $in: ['pending', 'active'] },
			}),
		]);

		if (myClanExistingWar) {
			const opponentId = myClanExistingWar.clans[0] === clanId ? myClanExistingWar.clans[1] : myClanExistingWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			return this.errorReply(`Your clan is already in a ${myClanExistingWar.status} war with ${opponent?.name || opponentId}.`);
		}

		if (targetClanExistingWar) {
			const opponentId = targetClanExistingWar.clans[0] === toID(targetClanId) ? targetClanExistingWar.clans[1] : targetClanExistingWar.clans[0];
			const opponent = await Clans.findOne({ _id: opponentId });
			return this.errorReply(`${targetClan.name} is already in a ${targetClanExistingWar.status} war with ${opponent?.name || opponentId}.`);
		}

		// Rematch bypasses cooldown
		await Clans.updateOne(
			{ _id: clanId },
			{ $set: { 'stats.lastWarChallenge': Date.now() } }
		);

		const newWar: Omit<ClanWar, '_id'> = {
			clans: [clanId, toID(targetClanId)],
			scores: { [clanId]: 0, [toID(targetClanId)]: 0 },
			status: 'pending',
			startDate: Date.now(),
			bestOf,
		};
		const insertResult = await ClanWars.insertOne(newWar as ClanWarDoc);
		const warId = insertResult.insertedId;
		if (!warId) {
			this.errorReply("There was an error creating the war document. Aborting.");
			return;
		}
		const war = await ClanWars.findOne({ _id: warId });
		if (!war) {
			this.errorReply("Failed to fetch the newly created war. Aborting.");
			return;
		}

		this.sendReply(`You have challenged ${targetClan.name} to a rematch (Best of ${bestOf})!`);

		const uhtmlId = `clan-war-card-${war._id}`;
		const challengerHtml = generateWarCard(war, myClan, targetClan, 'challenger');
		const targetHtml = generateWarCard(war, myClan, targetClan, 'target');
		const publicHtml = generateWarCard(war, myClan, targetClan, 'public');

		const targetRoom = Rooms.get(targetClan.chatRoom);
		const myRoom = Rooms.get(myClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (targetRoom) {
			targetRoom.add(`|uhtml|${uhtmlId}|${targetHtml}`).update();
		}
		if (myRoom) {
			myRoom.add(`|uhtml|${uhtmlId}|${challengerHtml}`).update();
		}
		if (lobbyRoom) {
			lobbyRoom.add(`|uhtml|${uhtmlId}|${publicHtml}`).update();
		}
	},

	// 2. Active War Management
	async forfeit(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const loserClanId = userClanInfo?.memberOf; // The clan forfeiting
		if (!loserClanId) return this.errorReply("You are not in a clan.");

		const loserClan = await Clans.findOne({ _id: loserClanId });
		if (!loserClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(loserClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to forfeit wars.");
		}

		const winnerClanId = toID(target);
		if (!winnerClanId) return this.errorReply("Specify the opponent clan ID. Usage: /clan war forfeit [clanid]");

		const war = await ClanWars.findOne({
			clans: { $all: [winnerClanId, loserClanId] },
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found with '${winnerClanId}'.`);

		const winnerClan = await Clans.findOne({ _id: winnerClanId });
		if (!winnerClan) return this.errorReply(`Opponent clan '${winnerClanId}' not found.`);

		// --- ELO Calculation ---
		const winnerOldElo = winnerClan.stats.elo || 1000;
		const loserOldElo = loserClan.stats.elo || 1000;
		const [newWinnerElo, newLoserElo, eloChange] = calculateElo(winnerOldElo, loserOldElo);

		// --- Database Updates ---
		try {
			await Promise.all([
				// Update winner's clan: SET new ELO, INC wins
				Clans.updateOne(
					{ _id: winnerClanId },
					{
						$set: { 'stats.elo': newWinnerElo },
						$inc: { 'stats.clanBattleWins': 1 },
					}
				),
				// Update loser's clan: SET new ELO, INC losses
				Clans.updateOne(
					{ _id: loserClanId },
					{
						$set: { 'stats.elo': newLoserElo },
						$inc: { 'stats.clanBattleLosses': 1 },
					}
				),
				// Update war doc: Set 'completed', end date
				ClanWars.updateOne(
					{ _id: war._id },
					{ $set: { status: 'completed', endDate: Date.now() } }
				),
				// Log this action (optional but recommended)
				logClanActivity(loserClanId, user.id, 'ADMIN_RESETSTATS', { // Using a random admin-level type
					target: winnerClanId,
					note: `Forfeited war. ELO changed from ${Math.floor(loserOldElo)} to ${Math.floor(newLoserElo)}.`,
				}),
				logClanActivity(winnerClanId, user.id, 'ADMIN_RESETSTATS', {
					target: loserClanId,
					note: `${loserClan.name} forfeited war. ELO changed from ${Math.floor(winnerOldElo)} to ${Math.floor(newWinnerElo)}.`,
				}),
			]);
		} catch (e) {
			this.errorReply("An error occurred while forfeiting the war. Please try again.");
			Monitor.crashlog(e as Error, "Clan War Forfeit", {
				warId: war._id,
				winnerClanId,
				loserClanId,
			});
			return;
		}

        // --- Find clan1 and clan2 for generateWarCard ---
        const [clan1, clan2] = await Promise.all([
            Clans.findOne({ _id: war.clans[0] }),
            Clans.findOne({ _id: war.clans[1] }),
        ]);
        if (!clan1 || !clan2) {
            this.errorReply("Could not find clan data for UHTML update.");
            return;
        }
        
        // Manually update local war object for card generation
        war.status = 'completed';

        const endMessage = `${loserClan.name} has forfeited the war to ${winnerClan.name}. ELO Change: ${eloChange}`;
        const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });
        const uhtmlId = `clan-war-card-${war._id}`;
        
		const winnerRoom = Rooms.get(winnerClan.chatRoom);
		const loserRoom = Rooms.get(loserClan.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (winnerRoom) winnerRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (loserRoom) loserRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
        
        // Send PM to user
        this.sendReply(`You have forfeited the war against ${winnerClan.name}. Your clan lost ${eloChange} ELO.`);
	},

	async tie(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}

		const opponentClanId = toID(target);
		if (!opponentClanId) return this.errorReply("Specify the opponent clan ID. Usage: /clan war tie [clanid]");

		const war = await ClanWars.findOne({
			clans: { $all: [clanId, opponentClanId] },
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found with '${opponentClanId}'.`);

		const opponentClan = await Clans.findOne({ _id: opponentClanId });
		if (!opponentClan) return this.errorReply(`Opponent clan '${opponentClanId}' not found.`);

		const tieConfirmations = war.tieConfirmations || [];
		const alreadyConfirmed = tieConfirmations.includes(clanId);

		if (alreadyConfirmed) {
			return this.errorReply(`Your clan has already confirmed the tie with ${opponentClan.name}.`);
		}

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $addToSet: { tieConfirmations: clanId } }
		);

		const updatedWar = await ClanWars.findOne({ _id: war._id });
		if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");
		const confirmations = updatedWar.tieConfirmations || [];
		
		// Determine who is clan1 (challenger) and clan2 (target)
        const [clan1, clan2] = war.clans[0] === myClan._id ? [myClan, opponentClan] : [opponentClan, myClan];
        const uhtmlId = `clan-war-card-${updatedWar._id}`;

		if (confirmations.length === 2) {
			await ClanWars.updateOne(
				{ _id: war._id },
				{ $set: { status: 'completed', endDate: Date.now() }, $unset: { tieConfirmations: 1 } }
			);

			const score1 = war.scores[clan1._id] || 0;
			const score2 = war.scores[clan2._id] || 0;
			
			const endMessage = `The war between ${clan1.name} and ${clan2.name} has ended in a draw! Final Score: ${score1} - ${score2}`;
			const endedHtml = generateWarCard(updatedWar, clan1, clan2, 'ended', { endMessage });

			const room1 = Rooms.get(clan1.chatRoom);
			const room2 = Rooms.get(clan2.chatRoom);
			const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);
			
			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();

			this.sendReply(`The war with ${opponentClan.name} has been concluded as a tie.`);
		} else {
			// This is the first proposal
			this.sendReply(`You have proposed ending the war as a tie. Waiting for ${opponentClan.name}'s decision...`);

            const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger');
            const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target');
            const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public');
            
            const room1 = Rooms.get(clan1.chatRoom);
            const room2 = Rooms.get(clan2.chatRoom);
            const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();
		}
	},

	async extend(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}

		const [opponentClanId, newBestOfStr] = target.split(',').map(s => s.trim());
		const newBestOf = parseInt(newBestOfStr);

		if (!opponentClanId) return this.errorReply("Specify the opponent clan ID. Usage: /clan war extend [clanid], [newbestof]");
		if (!newBestOf) return this.errorReply("You must specify a new 'Best of' number.");
		if (newBestOf < 1 || newBestOf % 2 === 0) {
			return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		}
		if (newBestOf > 101) return this.errorReply("'Best of' cannot be higher than 101.");

		const war = await ClanWars.findOne({
			clans: { $all: [clanId, toID(opponentClanId)] },
			status: 'active',
		});

		if (!war) return this.errorReply(`No active war found with '${opponentClanId}'.`);

		if (newBestOf <= war.bestOf) {
			return this.errorReply(`New best of (${newBestOf}) must be greater than current best of (${war.bestOf}).`);
		}

		const opponentClan = await Clans.findOne({ _id: toID(opponentClanId) });
		if (!opponentClan) return this.errorReply(`Opponent clan '${opponentClanId}' not found.`);

		const extendConfirmations = war.extendConfirmations || [];
		const alreadyConfirmed = extendConfirmations.some(
			(conf: any) => conf.clanId === clanId && conf.newBestOf === newBestOf
		);

		if (alreadyConfirmed) {
			return this.errorReply(`Your clan has already confirmed extending to Best of ${newBestOf}.`);
		}

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $push: { extendConfirmations: { clanId, newBestOf } } }
		);

		const updatedWar = await ClanWars.findOne({ _id: war._id });
		const confirmations = updatedWar?.extendConfirmations || [];
		const matchingConfirmations = confirmations.filter((conf: any) => conf.newBestOf === newBestOf);

		if (matchingConfirmations.length === 2) {
			await ClanWars.updateOne(
				{ _id: war._id },
				{ $set: { bestOf: newBestOf }, $unset: { extendConfirmations: 1 } }
			);

			const winsNeeded = Math.ceil(newBestOf / 2);
			const message = `|html|<div class="broadcast-blue"><center><strong>WAR EXTENDED!</strong><br />Both clans have agreed to extend the war!<br /><strong>New Format:</strong> Best of ${newBestOf} (First to ${winsNeeded} wins)<br />The battle for supremacy continues!</center></div>`;

			const room1 = Rooms.get(myClan.chatRoom);
			const room2 = Rooms.get(opponentClan.chatRoom);
			if (room1) room1.add(message).update();
			if (room2) room2.add(message).update();

			this.sendReply(`The war has been extended to Best of ${newBestOf}.`);
		} else {
			this.sendReply(`You have proposed extending the war to Best of ${newBestOf}. Waiting for ${opponentClan.name} to decide...`);

			const opponentRoom = Rooms.get(opponentClan.chatRoom);
			if (opponentRoom) {
				const newWinsNeeded = Math.ceil(newBestOf / 2);
				opponentRoom.add(`|html|<div class="broadcast-blue"><center><strong>EXTENSION PROPOSAL</strong><br /><strong>${myClan.name}</strong> wants to extend the war!<br /><strong>New Format:</strong> Best of ${newBestOf} (First to ${newWinsNeeded} wins)<br /><br />Use <strong>/clan war extend ${clanId}, ${newBestOf}</strong> to accept this proposal.</center></div>`).update();
			}
		}
	},

	async pause(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}

		const opponentClanId = toID(target);
		if (!opponentClanId) return this.errorReply("Specify the opponent clan ID. Usage: /clan war pause [clanid]");

		const war = await ClanWars.findOne({
			clans: { $all: [clanId, opponentClanId] },
			status: 'active',
		});

		if (!war) return this.errorReply(`No active war found with '${opponentClanId}'.`);

		if (war.paused) {
			return this.errorReply("This war is already paused.");
		}

		const opponentClan = await Clans.findOne({ _id: opponentClanId });
		if (!opponentClan) return this.errorReply(`Opponent clan '${opponentClanId}' not found.`);

		const pauseConfirmations = war.pauseConfirmations || [];
		const alreadyConfirmed = pauseConfirmations.includes(clanId);

		if (alreadyConfirmed) {
			return this.errorReply(`Your clan has already confirmed pausing the war.`);
		}

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $addToSet: { pauseConfirmations: clanId } }
		);

		const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");
		const confirmations = updatedWar.pauseConfirmations || [];

        // Determine who is clan1 (challenger) and clan2 (target)
        const [clan1, clan2] = war.clans[0] === myClan._id ? [myClan, opponentClan] : [opponentClan, myClan];
        const uhtmlId = `clan-war-card-${updatedWar._id}`;

		if (confirmations.length === 2) {
			await ClanWars.updateOne(
				{ _id: war._id },
				{ $set: { paused: true }, $unset: { pauseConfirmations: 1 } }
			);

			// Fetch the FINAL state of the war to generate the card
			const finalWar = await ClanWars.findOne({ _id: war._id });
			if (!finalWar) return this.errorReply("Failed to fetch final war data.");
            
            const finalChallengerHtml = generateWarCard(finalWar, clan1, clan2, 'challenger');
            const finalTargetHtml = generateWarCard(finalWar, clan1, clan2, 'target');
            const finalPublicHtml = generateWarCard(finalWar, clan1, clan2, 'public');
			
            const room1 = Rooms.get(clan1.chatRoom);
            const room2 = Rooms.get(clan2.chatRoom);
            const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${finalChallengerHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${finalTargetHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${finalPublicHtml}`).update();

			this.sendReply(`The war has been paused.`);
		} else {
			// This is the first proposal
			this.sendReply(`You have proposed pausing the war. Waiting for ${opponentClan.name} to agree...`);

            const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger');
            const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target');
            const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public');
            
            const room1 = Rooms.get(clan1.chatRoom);
            const room2 = Rooms.get(clan2.chatRoom);
            const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();
		}
	},

	async resume(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");

		const userClanInfo = await UserClans.findOne({ _id: user.id });
		const clanId = userClanInfo?.memberOf;
		if (!clanId) return this.errorReply("You are not in a clan.");

		const myClan = await Clans.findOne({ _id: clanId });
		if (!myClan) return this.errorReply("Your clan was not found.");

		if (!hasClanPermission(myClan, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}

		const opponentClanId = toID(target);
		if (!opponentClanId) return this.errorReply("Specify the opponent clan ID. Usage: /clan war resume [clanid]");

		const war = await ClanWars.findOne({
			clans: { $all: [clanId, opponentClanId] },
			status: 'active',
		});

		if (!war) return this.errorReply(`No active war found with '${opponentClanId}'.`);

		if (!war.paused) {
			return this.errorReply("This war is not paused.");
		}

		const opponentClan = await Clans.findOne({ _id: opponentClanId });
		if (!opponentClan) return this.errorReply(`Opponent clan '${opponentClanId}' not found.`);

		const resumeConfirmations = war.resumeConfirmations || [];
		const alreadyConfirmed = resumeConfirmations.includes(clanId);

		if (alreadyConfirmed) {
			return this.errorReply(`Your clan has already confirmed resuming the war.`);
		}

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $addToSet: { resumeConfirmations: clanId } }
		);

		const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");
		const confirmations = updatedWar.resumeConfirmations || [];
        
        // Determine who is clan1 (challenger) and clan2 (target)
        const [clan1, clan2] = war.clans[0] === myClan._id ? [myClan, opponentClan] : [opponentClan, myClan];
        const uhtmlId = `clan-war-card-${updatedWar._id}`;

		if (confirmations.length === 2) {
			await ClanWars.updateOne(
				{ _id: war._id },
				{ $set: { paused: false }, $unset: { resumeConfirmations: 1 } }
			);

			// Fetch the FINAL state of the war to generate the card
			const finalWar = await ClanWars.findOne({ _id: war._id });
			if (!finalWar) return this.errorReply("Failed to fetch final war data.");
            
            const finalChallengerHtml = generateWarCard(finalWar, clan1, clan2, 'challenger');
            const finalTargetHtml = generateWarCard(finalWar, clan1, clan2, 'target');
            const finalPublicHtml = generateWarCard(finalWar, clan1, clan2, 'public');
			
            const room1 = Rooms.get(clan1.chatRoom);
            const room2 = Rooms.get(clan2.chatRoom);
            const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${finalChallengerHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${finalTargetHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${finalPublicHtml}`).update();

			this.sendReply(`The war has been resumed.`);
		} else {
			// This is the first proposal
			this.sendReply(`You have confirmed resuming the war. Waiting for ${opponentClan.name} to agree...`);

            const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger');
            const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target');
            const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public');
            
            const room1 = Rooms.get(clan1.chatRoom);
            const room2 = Rooms.get(clan2.chatRoom);
            const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();
		}
	},

	// 3. Informational Commands (Read-only)
	async status(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		let clanId: ID;
		if (target) {
			clanId = toID(target);
		} else {
			const userClanInfo = await UserClans.findOne({ _id: user.id });
			if (!userClanInfo?.memberOf) {
				return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war status [clanid]).");
			}
			clanId = userClanInfo.memberOf;
		}

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

		const wars = await ClanWars.find(
			{ clans: clanId, status: { $in: ['pending', 'active'] } },
			{ limit: 50, sort: { startDate: -1 } }
		);

		if (!wars.length) {
			return this.sendReplyBox(`${clan.name} has no pending or active wars.`);
		}

		const headerRow = ['Opponent', 'Status', 'Battle Score (Us - Them)', 'Type', 'Started'];
		const dataRows: string[][] = [];
		const title = `${clan.name} War Status`;

		for (const war of wars) {
			const opponentId = war.clans[0] === clanId ? war.clans[1] : war.clans[0];
			const opponentClan = await Clans.findOne({ _id: opponentId });
			const myScore = war.scores[clanId] || 0;
			const opponentScore = war.scores[opponentId] || 0;

			dataRows.push([
				opponentClan?.name || opponentId,
				war.status === 'active' ? `<strong style="color:green;">Active</strong>` : `<em style="color:gray;">Pending</em>`,
				`<strong>${myScore} - ${opponentScore}</strong>`,
				`Best of ${war.bestOf}`,
				to(new Date(war.startDate), { date: true }),
			]);
		}

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},

	'': 'status',

	async ladder(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		const [pageStr, sortBy] = target.split(',').map(s => s.trim());
		const page = parseInt(pageStr) || 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		let sortField: string;
		let headerName: string;
		const sortOrder: 1 | -1 = -1;

		const sortType = toID(sortBy);
		switch (sortType) {
		case 'wins':
			sortField = 'stats.clanBattleWins';
			headerName = 'Wins';
			break;
		case 'losses':
			sortField = 'stats.clanBattleLosses';
			headerName = 'Losses';
			break;
		case 'winrate':
			// Will be calculated after fetching
			sortField = 'stats.clanBattleWins';
			headerName = 'Win Rate';
			break;
		case 'elo':
		default:
			sortField = 'stats.elo';
			headerName = 'ELO';
			break;
		}

		const clans = await Clans.find({}, { skip: 0, limit: 1000, sort: { [sortField]: sortOrder } });

		// Filter clans that have participated in wars (at least 1 win or loss)
		let warClans = clans.filter(clan =>
			(clan.stats.clanBattleWins || 0) > 0 || (clan.stats.clanBattleLosses || 0) > 0
		);

		// Sort by winrate if requested
		if (sortType === 'winrate') {
			warClans = warClans.sort((a, b) => {
				const aWins = a.stats.clanBattleWins || 0;
				const aLosses = a.stats.clanBattleLosses || 0;
				const aTotal = aWins + aLosses;
				const aWinrate = aTotal > 0 ? (aWins / aTotal) * 100 : 0;

				const bWins = b.stats.clanBattleWins || 0;
				const bLosses = b.stats.clanBattleLosses || 0;
				const bTotal = bWins + bLosses;
				const bWinrate = bTotal > 0 ? (bWins / bTotal) * 100 : 0;

				return bWinrate - aWinrate;
			});
		}

		const total = warClans.length;
		const totalPages = Math.ceil(total / limit);
		const paginatedClans = warClans.slice(skip, skip + limit);

		if (paginatedClans.length === 0) {
			return this.errorReply("No clans have participated in wars yet.");
		}

		const dataRows: string[][] = [];
		const headerRow = ['Rank', 'Clan', 'ELO Rating', 'Battle Wins', 'Battle Losses', 'Win %'];
		const title = `Pokémon Clan War Ladder (Page ${page}/${totalPages}) - Sorted by ${headerName}`;

		paginatedClans.forEach((clan, i) => {
			const wins = clan.stats.clanBattleWins || 0;
			const losses = clan.stats.clanBattleLosses || 0;
			const totalBattles = wins + losses;
			const winrate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(1) : '0.0';
			const elo = Math.floor(clan.stats.elo || 1000);

			dataRows.push([
				`<strong>#${(skip + i + 1)}</strong>`,
				clan.name,
				`<strong style="font-size: 1.1em;">${elo}</strong>`,
				wins.toString(),
				losses.toString(),
				`<strong>${winrate}%</strong>`,
			]);
		});

		let output = generateThemedTable(title, headerRow, dataRows);

		const cmd = `/clan war ladder`;
		if (page > 1 || page < totalPages) {
			output += '<center>';
			if (page > 1) {
				output += `<button class="button" name="send" value="${cmd} ${page - 1}, ${sortType || 'elo'}">◀️ Previous</button> `;
			}
			if (page < totalPages) {
				output += `<button class="button" name="send" value="${cmd} ${page + 1}, ${sortType || 'elo'}">Next</button>`;
			}
			output += '</center>';
		}

		// Add buttons to change sort
		output += `<br /><center><small>Sort by: ` +
			`<button class="button" name="send" value="${cmd} 1, elo">ELO Rating</button> ` +
			`<button class="button" name="send" value="${cmd} 1, wins">Battle Wins</button> ` +
			`<button class="button" name="send" value="${cmd} 1, losses">Battle Losses</button> ` +
			`<button class="button" name="send" value="${cmd} 1, winrate">Win Rate</button>` +
			`</small></center>`;

		this.sendReply(`|html|${output}`);
	},

	async stats(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		let clanId: ID;
		if (target) {
			clanId = toID(target);
		} else {
			const userClanInfo = await UserClans.findOne({ _id: user.id });
			if (!userClanInfo?.memberOf) {
				return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war stats [clanid]).");
			}
			clanId = userClanInfo.memberOf;
		}

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

		const [completedWars, activePendingWars, battleLogs] = await Promise.all([
			ClanWars.find({ clans: clanId, status: 'completed' }, {}),
			ClanWars.find({ clans: clanId, status: { $in: ['pending', 'active'] } }, {}),
			ClanBattleLogs.find({ $or: [{ winningClan: clanId }, { losingClan: clanId }] }, {}),
		]);

		const wins = clan.stats.clanBattleWins || 0;
		const losses = clan.stats.clanBattleLosses || 0;
		const totalBattles = wins + losses;
		const winrate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(1) : '0.0';
		const elo = Math.floor(clan.stats.elo || 1000);

		// Calculate war stats
		let warsWon = 0;
		let warsLost = 0;
		let warsTied = 0;
		let totalWarBattles = 0;

		for (const war of completedWars) {
			const myScore = war.scores[clanId] || 0;
			const opponentId = war.clans[0] === clanId ? war.clans[1] : war.clans[0];
			const opponentScore = war.scores[opponentId] || 0;
			totalWarBattles += myScore + opponentScore;

			if (myScore > opponentScore) warsWon++;
			else if (myScore < opponentScore) warsLost++;
			else warsTied++;
		}

		const totalWars = warsWon + warsLost + warsTied;
		const warWinrate = totalWars > 0 ? ((warsWon / totalWars) * 100).toFixed(1) : '0.0';

		// Calculate win streak
		let currentStreak = 0;
		let longestWinStreak = 0;
		const sortedLogs = battleLogs.sort((a, b) => b.timestamp - a.timestamp);

		for (const log of sortedLogs) {
			if (log.winningClan === clanId) {
				currentStreak++;
				if (currentStreak > longestWinStreak) longestWinStreak = currentStreak;
			} else {
				currentStreak = 0;
			}
		}

		let html = `<div class="infobox" style="max-width:650px;"><center><strong style="font-size: 1.3em;">⚔️ ${clan.name} Pokémon War Statistics ⚔️</strong></center><hr>`;
		html += `<strong>💪 Individual Battle Performance:</strong><br>`;
		html += `Clan ELO Rating: <strong style="font-size: 1.15em; color: gold;">${elo}</strong><br>`;
		html += `Total 1v1 Battles Fought: <strong>${totalBattles}</strong> (${wins}W - ${losses}L)<br>`;
		html += `Battle Win Rate: <strong style="color: green;">${winrate}%</strong><br>`;
		html += `Best Win Streak: <strong>${longestWinStreak}</strong> consecutive victories<br><hr>`;

		html += `<strong>War Record:</strong><br>`;
		html += `Total Wars: <strong>${totalWars}</strong> (${warsWon}W - ${warsLost}L - ${warsTied}D)<br>`;
		html += `War Win Rate: <strong style="color: green;">${warWinrate}%</strong><br>`;
		html += `Active/Pending Wars: <strong>${activePendingWars.length}</strong><br>`;
		html += `Total Battles Across All Wars: <strong>${totalWarBattles}</strong><br>`;
		html += `</div>`;

		this.sendReply(`|html|${html}`);
	},

	async history(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		let clanId: ID;
		if (target) {
			clanId = toID(target);
		} else {
			const userClanInfo = await UserClans.findOne({ _id: user.id });
			if (!userClanInfo?.memberOf) {
				return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war history [clanid]).");
			}
			clanId = userClanInfo.memberOf;
		}

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

		const wars = await ClanWars.find(
			{ clans: clanId, status: 'completed' },
			{ limit: 50, sort: { endDate: -1 } }
		);

		if (!wars.length) {
			return this.sendReplyBox(`${clan.name} has no completed war history.`);
		}

		const headerRow = ['Opponent', 'Result', 'Battle Score', 'Format', 'Date'];
		const dataRows: string[][] = [];
		const title = `${clan.name} War History (Last ${wars.length} Wars)`;

		for (const war of wars) {
			const opponentId = war.clans[0] === clanId ? war.clans[1] : war.clans[0];
			const opponentClan = await Clans.findOne({ _id: opponentId });
			const myScore = war.scores[clanId] || 0;
			const opponentScore = war.scores[opponentId] || 0;

			let result: string;
			let resultColor: string;
			if (myScore > opponentScore) {
				result = '✅ WIN';
				resultColor = 'green';
			} else if (myScore < opponentScore) {
				result = '❌ LOSS';
				resultColor = 'red';
			} else {
				result = 'TIE';
				resultColor = 'gray';
			}

			dataRows.push([
				opponentClan?.name || opponentId,
				`<strong style="color:${resultColor};">${result}</strong>`,
				`${myScore} - ${opponentScore}`,
				`Best of ${war.bestOf}`,
				war.endDate ? to(new Date(war.endDate), { date: true }) : 'N/A',
			]);
		}

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},

	async record(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		const [clan1Id, clan2Id] = target.split(',').map(s => toID(s.trim()));
		if (!clan1Id || !clan2Id) {
			return this.errorReply("Usage: /clan war record [clan1], [clan2]");
		}

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: clan1Id }),
			Clans.findOne({ _id: clan2Id }),
		]);

		if (!clan1) return this.errorReply(`Clan '${clan1Id}' not found.`);
		if (!clan2) return this.errorReply(`Clan '${clan2Id}' not found.`);

		const wars = await ClanWars.find({
			clans: { $all: [clan1Id, clan2Id] },
			status: 'completed',
		}, {});

		if (!wars.length) {
			return this.sendReplyBox(`${clan1.name} and ${clan2.name} have no war history together.`);
		}

		let clan1Wins = 0;
		let clan2Wins = 0;
		let ties = 0;
		let clan1BattleWins = 0;
		let clan2BattleWins = 0;

		for (const war of wars) {
			const score1 = war.scores[clan1Id] || 0;
			const score2 = war.scores[clan2Id] || 0;

			clan1BattleWins += score1;
			clan2BattleWins += score2;

			if (score1 > score2) clan1Wins++;
			else if (score2 > score1) clan2Wins++;
			else ties++;
		}

		let html = `<div class="infobox" style="max-width:550px;"><center><strong style="font-size: 1.2em;">Head-to-Head Rivalry</strong></center><hr>`;
		html += `<center><strong style="font-size: 1.15em;">${clan1.name} vs ${clan2.name}</strong></center><br>`;
		html += `<strong>Wars Won:</strong> ${clan1.name} ${clan1Wins}W - ${clan2Wins}W ${clan2.name}<br>`;
		html += `<strong>Battles Won:</strong> ${clan1.name} ${clan1BattleWins} - ${clan2BattleWins} ${clan2.name}<br>`;
		html += `<strong>Tied Wars:</strong> ${ties}<br>`;
		html += `<strong>Total Wars Played:</strong> ${wars.length}<br>`;
		html += `</div>`;

		this.sendReply(`|html|${html}`);
	},

	async mvp(target, room, user) {
		this.runBroadcast();
		this.checkChat();

		let clanId: ID;
		if (target) {
			clanId = toID(target);
		} else {
			const userClanInfo = await UserClans.findOne({ _id: user.id });
			if (!userClanInfo?.memberOf) {
				return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war mvp [clanid]).");
			}
			clanId = userClanInfo.memberOf;
		}

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

		const battleLogs = await ClanBattleLogs.find(
			{ winningClan: clanId },
			{}
		);

		if (!battleLogs.length) {
			return this.sendReplyBox(`${clan.name} has no war battle wins yet.`);
		}

		// Count wins per member
		const memberWins: { [userid: string]: number } = {};
		for (const log of battleLogs) {
			memberWins[log.winner] = (memberWins[log.winner] || 0) + 1;
		}

		// Sort by wins
		const sortedMembers = Object.entries(memberWins).sort((a, b) => b[1] - a[1]);
		const top10 = sortedMembers.slice(0, 10);

		const headerRow = ['Rank', 'Top Trainer', 'War Victories'];
		const dataRows: string[][] = [];
		const title = `${clan.name} War MVPs - Top Trainers`;

		top10.forEach(([userid, wins], i) => {
			dataRows.push([
				`<strong>#${i + 1}</strong>`,
				userid,
				`<strong style="font-size: 1.1em; color: gold;">${wins}</strong>`,
			]);
		});

		const output = generateThemedTable(title, headerRow, dataRows);
		this.sendReply(`|html|${output}`);
	},

	// 4. Admin Commands (Forceful actions)
	async forceend(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const targetClanId = toID(target);
		if (!targetClanId) return this.errorReply("Specify a clan ID. Usage: /clan war forceend [clanid]");

		const targetClan = await Clans.findOne({ _id: targetClanId });
		if (!targetClan) return this.errorReply(`Clan '${targetClanId}' not found.`);

		const war = await ClanWars.findOne({
			clans: targetClanId,
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found for clan '${targetClanId}'.`);

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { status: 'completed', endDate: Date.now() } }
		);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: war.clans[0] }),
			Clans.findOne({ _id: war.clans[1] }),
		]);
		if (!clan1 || !clan2) return this.errorReply("A clan was deleted.");

		const score1 = war.scores[clan1._id] || 0;
		const score2 = war.scores[clan2._id] || 0;
        
        const uhtmlId = `clan-war-card-${war._id}`;
        const endMessage = `[ADMIN] ${user.name} has concluded the war. Final Score: ${score1} - ${score2}`;
        const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);
		
		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();

		this.sendReply(`Force ended the war between ${clan1.name} and ${clan2.name}.`);
	},

	async forcetie(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const targetClanId = toID(target);
		if (!targetClanId) return this.errorReply("Specify a clan ID. Usage: /clan war forcetie [clanid]");

		const targetClan = await Clans.findOne({ _id: targetClanId });
		if (!targetClan) return this.errorReply(`Clan '${targetClanId}' not found.`);

		const war = await ClanWars.findOne({
			clans: targetClanId,
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found for clan '${targetClanId}'.`);

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { status: 'completed', endDate: Date.now() } }
		);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: war.clans[0] }),
			Clans.findOne({ _id: war.clans[1] }),
		]);
		if (!clan1 || !clan2) return this.errorReply("A clan was deleted.");

		const score1 = war.scores[clan1._id] || 0;
		const score2 = war.scores[clan2._id] || 0;

        const uhtmlId = `clan-war-card-${war._id}`;
        const endMessage = `[ADMIN] ${user.name} has declared the war a tie. Final Score: ${score1} - ${score2}`;
        const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();

		this.sendReply(`Force tied the war between ${clan1.name} and ${clan2.name}.`);
	},

	async forfeitadmin(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const [loserClanId, winnerClanId] = target.split(',').map(s => toID(s.trim()));
		if (!loserClanId || !winnerClanId) {
			return this.errorReply("Usage: /clan war forfeitadmin [loserclanid], [winnerclanid]");
		}

		const [loserClan, winnerClan] = await Promise.all([
			Clans.findOne({ _id: loserClanId }),
			Clans.findOne({ _id: winnerClanId }),
		]);

		if (!loserClan) return this.errorReply(`Clan '${loserClanId}' not found.`);
		if (!winnerClan) return this.errorReply(`Clan '${winnerClanId}' not found.`);

		const war = await ClanWars.findOne({
			clans: { $all: [loserClanId, winnerClanId] },
			status: 'active',
		});

		if (!war) return this.errorReply(`No active war found between these clans.`);

		// Calculate ELO
		const winnerOldElo = winnerClan.stats.elo || 1000;
		const loserOldElo = loserClan.stats.elo || 1000;
		const [newWinnerElo, newLoserElo, eloChange] = calculateElo(winnerOldElo, loserOldElo);

		try {
			await Promise.all([
				Clans.updateOne(
					{ _id: winnerClanId },
					{
						$set: { 'stats.elo': newWinnerElo },
						$inc: { 'stats.clanBattleWins': 1 },
					}
				),
				Clans.updateOne(
					{ _id: loserClanId },
					{
						$set: { 'stats.elo': newLoserElo },
						$inc: { 'stats.clanBattleLosses': 1 },
					}
				),
				ClanWars.updateOne(
					{ _id: war._id },
					{ $set: { status: 'completed', endDate: Date.now() } }
				),
				logClanActivity(loserClanId, user.id, 'ADMIN_RESETSTATS', {
					target: winnerClanId,
					note: `[ADMIN] ${user.name} force forfeited war. ELO: ${Math.floor(loserOldElo)} → ${Math.floor(newLoserElo)}.`,
				}),
				logClanActivity(winnerClanId, user.id, 'ADMIN_RESETSTATS', {
					target: loserClanId,
					note: `[ADMIN] ${user.name} awarded war victory. ELO: ${Math.floor(winnerOldElo)} → ${Math.floor(newWinnerElo)}.`,
				}),
			]);

            // --- Find clan1 and clan2 for generateWarCard ---
            const [clan1, clan2] = await Promise.all([
                Clans.findOne({ _id: war.clans[0] }),
                Clans.findOne({ _id: war.clans[1] }),
            ]);
            if (!clan1 || !clan2) {
                this.errorReply("Could not find clan data for UHTML update.");
                return;
            }
            
            // Manually update local war object for card generation
            war.status = 'completed';

            const endMessage = `[ADMIN] ${user.name} has forced ${loserClan.name} to forfeit to ${winnerClan.name}. ELO Change: ${eloChange}`;
            const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });
            const uhtmlId = `clan-war-card-${war._id}`;
            
			const winnerRoom = Rooms.get(winnerClan.chatRoom);
			const loserRoom = Rooms.get(loserClan.chatRoom);
			const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (winnerRoom) winnerRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			if (loserRoom) loserRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();

			this.sendReply(`Force forfeited war: ${loserClan.name} loses to ${winnerClan.name}.`);
		} catch (e) {
			this.errorReply("An error occurred while forfeiting the war.");
			Monitor.crashlog(e as Error, "Admin Forfeit War", {
				warId: war._id,
				winnerClanId,
				loserClanId,
			});
		}
	},

	async resetcooldown(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const clanId = toID(target);
		if (!clanId) return this.errorReply("Specify a clan ID. Usage: /clan war resetcooldown [clanid]");

		const clan = await Clans.findOne({ _id: clanId });
		if (!clan) return this.errorReply(`Clan '${clanId}' not found.`);

		await Clans.updateOne(
			{ _id: clanId },
			{ $unset: { 'stats.lastWarChallenge': 1 } }
		);

		await logClanActivity(clanId, user.id, 'ADMIN_RESETSTATS', {
			note: `[ADMIN] ${user.name} reset war challenge cooldown.`,
		});

		this.sendReply(`Reset war challenge cooldown for clan '${clan.name}'.`);

		const clanRoom = Rooms.get(clan.chatRoom);
		if (clanRoom) {
			clanRoom.add(`|html|<div class="broadcast-red"><center><strong>COOLDOWN RESET</strong><br />By order of Admin ${user.name}, your clan may challenge again immediately!</center></div>`).update();
		}
	},

	async setscore(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const [clan1Id, score1Str, clan2Id, score2Str] = target.split(',').map(s => s.trim());
		const score1 = parseInt(score1Str);
		const score2 = parseInt(score2Str);

		if (!clan1Id || !clan2Id || isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
			return this.errorReply("Usage: /clan war setscore [clan1id], [score1], [clan2id], [score2]");
		}

		const c1ID = toID(clan1Id);
		const c2ID = toID(clan2Id);

		const war = await ClanWars.findOne({
			clans: { $all: [c1ID, c2ID] },
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found between '${c1ID}' and '${c2ID}'.`);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!clan1 || !clan2) return this.errorReply("One or both clans not found.");

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { scores: { [c1ID]: score1, [c2ID]: score2 } } }
		);
        
        const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");
        
        const uhtmlId = `clan-war-card-${updatedWar._id}`;
        const lastBattle = {
            winnerName: "Admin",
            loserName: `${user.name}`,
            winningClanName: `Score manually set to ${score1} - ${score2}`,
        };
        const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger', { lastBattle });
        const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target', { lastBattle });
		const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public', { lastBattle });

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();

		this.sendReply(`War score updated. ${clan1.name}: ${score1}, ${clan2.name}: ${score2}.`);
	},

	async setbestof(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const [clan1Id, clan2Id, bestOfStr] = target.split(',').map(s => s.trim());
		const newBestOf = parseInt(bestOfStr);

		if (!clan1Id || !clan2Id || isNaN(newBestOf)) {
			return this.errorReply("Usage: /clan war setbestof [clan1id], [clan2id], [newbestof]");
		}
		if (newBestOf < 1 || newBestOf % 2 === 0) {
			return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		}
		if (newBestOf > 101) return this.errorReply("'Best of' cannot be higher than 101.");

		const c1ID = toID(clan1Id);
		const c2ID = toID(clan2Id);

		const war = await ClanWars.findOne({
			clans: { $all: [c1ID, c2ID] },
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found between '${c1ID}' and '${c2ID}'.`);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!clan1 || !clan2) return this.errorReply("One or both clans not found.");

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { bestOf: newBestOf } }
		);

        const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");
        
        const uhtmlId = `clan-war-card-${updatedWar._id}`;
        const lastBattle = {
            winnerName: "Admin",
            loserName: `${user.name}`,
            winningClanName: `Format changed to Best of ${newBestOf}`,
        };
        const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger', { lastBattle });
        const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target', { lastBattle });
		const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public', { lastBattle });

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();

		this.sendReply(`War 'Best of' updated to ${newBestOf} for the war between ${clan1.name} and ${clan2.name}.`);
	},

	async forcepause(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const clanId = toID(target);
		if (!clanId) return this.errorReply("Usage: /clan war forcepause [clanid]");

		const war = await ClanWars.findOne({
			clans: clanId,
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found for clan '${clanId}'.`);
		if (war.paused) return this.errorReply("This war is already paused.");

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { paused: true }, $unset: { pauseConfirmations: 1, resumeConfirmations: 1 } }
		);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: war.clans[0] }),
			Clans.findOne({ _id: war.clans[1] }),
		]);
		if (!clan1 || !clan2) return this.errorReply("A clan was deleted.");
        
        const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");

        const uhtmlId = `clan-war-card-${updatedWar._id}`;
        const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger');
        const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target');
		const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public');

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();

		this.sendReply(`War between ${clan1.name} and ${clan2.name} has been paused.`);
	},

	async forceresume(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const clanId = toID(target);
		if (!clanId) return this.errorReply("Usage: /clan war forceresume [clanid]");

		const war = await ClanWars.findOne({
			clans: clanId,
			status: 'active',
		});
		if (!war) return this.errorReply(`No active war found for clan '${clanId}'.`);
		if (!war.paused) return this.errorReply("This war is not paused.");

		await ClanWars.updateOne(
			{ _id: war._id },
			{ $set: { paused: false }, $unset: { pauseConfirmations: 1, resumeConfirmations: 1 } }
		);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: war.clans[0] }),
			Clans.findOne({ _id: war.clans[1] }),
		]);
		if (!clan1 || !clan2) return this.errorReply("A clan was deleted.");

        const updatedWar = await ClanWars.findOne({ _id: war._id });
        if (!updatedWar) return this.errorReply("Failed to fetch war data after update.");

        const uhtmlId = `clan-war-card-${updatedWar._id}`;
        const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger');
        const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target');
		const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public');

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

		if (room1) room1.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
		if (room2) room2.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();

		this.sendReply(`War between ${clan1.name} and ${clan2.name} has been resumed.`);
	},

	async clearpending(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const [clan1Id, clan2Id] = target.split(',').map(s => toID(s.trim()));
		if (!clan1Id || !clan2Id) {
			return this.errorReply("Usage: /clan war clearpending [clan1id], [clan2id]");
		}

		const war = await ClanWars.findOne({
			clans: { $all: [clan1Id, clan2Id] },
			status: 'pending',
		});
		if (!war) return this.errorReply(`No pending war found between '${clan1Id}' and '${clan2Id}'.`);

		await ClanWars.deleteOne({ _id: war._id });

		// We can't update the UHTML card because it's already deleted.
		// We'll just clear it from the rooms.
		const uhtmlId = `clan-war-card-${war._id}`;
		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: war.clans[0] }),
			Clans.findOne({ _id: war.clans[1] }),
		]);
		if (clan1) {
			const room1 = Rooms.get(clan1.chatRoom);
			if (room1) room1.add(`|uhtmlchange|${uhtmlId}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();
		}
		if (clan2) {
			const room2 = Rooms.get(clan2.chatRoom);
			if (room2) room2.add(`|uhtmlchange|${uhtmlId}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();
		}
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);
		if (lobbyRoom) lobbyRoom.add(`|uhtmlchange|${uhtmlId}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();

		this.sendReply(`Deleted pending war challenge between '${clan1Id}' and '${clan2Id}'.`);
	},

	async forcecreate(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');

		const [clan1Id, clan2Id, bestOfStr] = target.split(',').map(s => s.trim());
		const bestOf = parseInt(bestOfStr);

		if (!clan1Id || !clan2Id || isNaN(bestOf)) {
			return this.errorReply("Usage: /clan war forcecreate [clan1id], [clan2id], [bestof]");
		}
		if (bestOf < 1 || bestOf % 2 === 0) {
			return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		}
		if (bestOf > 101) return this.errorReply("'Best of' cannot be higher than 101.");

		const c1ID = toID(clan1Id);
		const c2ID = toID(clan2Id);

		const [clan1, clan2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!clan1) return this.errorReply(`Clan '${clan1Id}' not found.`);
		if (!clan2) return this.errorReply(`Clan '${clan2Id}' not found.`);
		if (c1ID === c2ID) return this.errorReply("Clans must be different.");

		// Check if either clan already has an active or pending war
		const [clan1ExistingWar, clan2ExistingWar] = await Promise.all([
			ClanWars.findOne({
				clans: c1ID,
				status: { $in: ['pending', 'active'] },
			}),
			ClanWars.findOne({
				clans: c2ID,
				status: { $in: ['pending', 'active'] },
			}),
		]);

		if (clan1ExistingWar) {
			return this.errorReply(`${clan1.name} is already in a war.`);
		}
		if (clan2ExistingWar) {
			return this.errorReply(`${clan2.name} is already in a war.`);
		}

		const newWar: Omit<ClanWar, '_id'> = {
			clans: [c1ID, c2ID],
			scores: { [c1ID]: 0, [c2ID]: 0 },
			status: 'active',
			startDate: Date.now(),
			bestOf,
		};
		const insertResult = await ClanWars.insertOne(newWar as ClanWarDoc);
        const warId = insertResult.insertedId;
        if (!warId) {
            this.errorReply("There was an error creating the war document. Aborting.");
            return;
        }
        const war = await ClanWars.findOne({ _id: warId });
        if (!war) {
            this.errorReply("Failed to fetch the newly created war. Aborting.");
            return;
        }

        const uhtmlId = `clan-war-card-${war._id}`;
        const lastBattle = {
            winnerName: "Admin",
            loserName: `${user.name}`,
            winningClanName: "War forcibly started",
        };
        const challengerHtml = generateWarCard(war, clan1, clan2, 'challenger', { lastBattle });
        const targetHtml = generateWarCard(war, clan1, clan2, 'target', { lastBattle });
		const publicHtml = generateWarCard(war, clan1, clan2, 'public', { lastBattle });

		const room1 = Rooms.get(clan1.chatRoom);
		const room2 = Rooms.get(clan2.chatRoom);
		const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);
		
		if (room1) room1.add(`|uhtml|${uhtmlId}|${challengerHtml}`).update();
		if (room2) room2.add(`|uhtml|${uhtmlId}|${targetHtml}`).update();
		if (lobbyRoom) lobbyRoom.add(`|uhtml|${uhtmlId}|${publicHtml}`).update();

		this.sendReply(`Force-started an active war between ${clan1.name} and ${clan2.name}.`);
	},

	// 5. Help
	help() {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/clan war status [clanid]", desc: "View your clan's active/pending war status. Defaults to your clan." },
			{ cmd: "/clan war challenge [clanid], [bestof]", desc: "Challenge another clan to a Pokémon War." },
			{ cmd: "/clan war accept [clanid]", desc: "Accept a pending war challenge." },
			{ cmd: "/clan war deny [clanid]", desc: "Deny a pending war challenge." },
			{ cmd: "/clan war cancel [clanid]", desc: "Cancel a pending war challenge you have sent." },
			{ cmd: "/clan war forfeit [clanid]", desc: "Forfeit your active war against an opponent." },
			{ cmd: "/clan war tie [clanid]", desc: "Propose or confirm ending an active war as a tie." },
			{ cmd: "/clan war extend [clanid], [newbestof]", desc: "Propose or confirm extending an active war to more battles." },
			{ cmd: "/clan war pause [clanid]", desc: "Propose or confirm pausing an active war." },
			{ cmd: "/clan war resume [clanid]", desc: "Propose or confirm resuming a paused war." },
			{ cmd: "/clan war rematch [clanid], [bestof]", desc: "Challenge a clan to a rematch, bypassing the 24h cooldown." },
			{ cmd: "/clan war ladder [page], [sortby]", desc: "View the Pokémon War ladder. Sort by elo, wins, losses, winrate." },
			{ cmd: "/clan war stats [clanid]", desc: "View a clan's detailed war statistics." },
			{ cmd: "/clan war history [clanid]", desc: "View a clan's completed war history." },
			{ cmd: "/clan war record [clan1], [clan2]", desc: "View the head-to-head rivalry between two clans." },
			{ cmd: "/clan war mvp [clanid]", desc: "View the top trainers (MVPs) for a clan." },
			{ cmd: "/clan war forceend [clanid]", desc: "Forcefully end an active war. Requires: &." },
			{ cmd: "/clan war forcetie [clanid]", desc: "Forcefully end an active war as a tie. Requires: &." },
			{ cmd: "/clan war forfeitadmin [loserclanid], [winnerclanid]", desc: "Force a clan to forfeit to another. Requires: &." },
			{ cmd: "/clan war resetcooldown [clanid]", desc: "Reset a clan's war challenge cooldown. Requires: &." },
			{ cmd: "/clan war setscore [clan1id], [score1], [clan2id], [score2]", desc: "Manually adjust battle score of an active war. Requires: &." },
			{ cmd: "/clan war setbestof [clan1id], [clan2id], [newbestof]", desc: "Change the 'Best of' format for an active war. Requires: &." },
			{ cmd: "/clan war forcepause [clanid]", desc: "Forcibly pause an active war. Requires: &." },
			{ cmd: "/clan war forceresume [clanid]", desc: "Forcibly resume a paused war. Requires: &." },
			{ cmd: "/clan war clearpending [clan1id], [clan2id]", desc: "Delete a pending war challenge. Requires: &." },
			{ cmd: "/clan war forcecreate [clan1id], [clan2id], [bestof]", desc: "Instantly create an active war. Requires: &." },
		];
		const html = `<center><strong> Pokémon Clan War Commands </strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 380px; overflow-y: auto;">${html}</div>`);
	},
};
