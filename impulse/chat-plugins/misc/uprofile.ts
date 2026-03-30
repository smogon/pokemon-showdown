/*
 * Pokemon Showdown - Impulse       * Server
 * User Profile Plugin
 * @author TurboRx
 */
import { ImpulseDB } from '../../impulse-db';
import { Net } from '../../../lib';
import { getAvatarName } from '../../avatar-names';
import { Clans, UserClans } from '../clans/database';
import type { TcgUserProfile } from '../tcg/interface';
import { toID } from '../../../sim/dex';
import { getTotalOntime, getCurrentSessionTime } from './ontime';

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-ps.mooo.com/avatars/';

interface ProfileSettingsDocument {
	_id: string;
	status?: string;
	backgroundType?: 'image' | 'color';
	backgroundValue?: string;
	textColor?: string;
	updatedAt: Date;
}

const ProfileSettingsDB = ImpulseDB<ProfileSettingsDocument>('profilesettings');
const TcgProfileDB = ImpulseDB<TcgUserProfile>('tcg_profiles');

function isValidHexColor(value: string): boolean {
	return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function isValidImageUrl(value: string): boolean {
	try {
		const url = new URL(value);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			return false;
		}
		// check for common image extensions (excluding SVG for security reasons)
		const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
		const pathname = url.pathname.toLowerCase();
		return imageExtensions.some(ext => pathname.endsWith(ext));
	} catch {
		return false;
	}
}

// cache for registration data to avoid repeated API calls
interface RegistrationCacheEntry {
	data: { registertime?: number, username?: string } | null;
	timestamp: number;
}

const registrationCache = new Map<string, RegistrationCacheEntry>();
const REGISTRATION_CACHE_DURATION = 10 * 60 * 1000; // 10 mins

async function getRegistrationData(userid: string): Promise<{ registertime?: number, username?: string } | null> {
	// check cache first
	const cached = registrationCache.get(userid);
	if (cached && (Date.now() - cached.timestamp) < REGISTRATION_CACHE_DURATION) {
		return cached.data;
	}

	try {
		const response = await Net(`https://${Config.routes.root}/users/${userid}.json`).get();
		const parsed = JSON.parse(response);

		// validate the response structure before using it
		const data = (parsed && typeof parsed === 'object') ? {
			registertime: typeof parsed.registertime === 'number' ? parsed.registertime : undefined,
			username: typeof parsed.username === 'string' ? parsed.username : undefined,
		} : null;

		// cache the result (even if null/invalid - to prevent repeated failed requests)
		registrationCache.set(userid, { data, timestamp: Date.now() });

		return data;
	} catch {
		if (cached) {
			return cached.data;
		}
		registrationCache.set(userid, { data: null, timestamp: Date.now() });
		return null;
	}
}

/**
 * get the avatar display for a user, including custom avatars
 * for offline users, shows 'unknown' avatar
 */
function getAvatarDisplay(user: User | null): string {
	let avatar: string | number | undefined;
	let avatarUrl = '';

	if (user?.connected) {
		avatar = user.avatar;
	} else {

		avatar = 'unknown';
	}

	// check if user has a custom avatar (file with extension)
	if (avatar && typeof avatar === 'string' && avatar.includes('.')) {
		// custom avatar from config/avatars/ - serve directly
		// don't use Avatars.src() as it returns empty string for files with extensions
		avatarUrl = `${getAvatarBaseUrl()}${avatar}`;
	} else {

		const avatarName = getAvatarName(avatar);

		// use the server's avatar system for official avatars
		if (Users.Avatars?.src) {
			avatarUrl = Users.Avatars.src(avatarName);
		}

		if (!avatarUrl) {
			avatarUrl = `https://${Config.routes.client}/sprites/trainers/${avatarName}.png`;
		}
	}

	return `<img src='${avatarUrl}' width='80' height='80' class='pixelated' style='vertical-align:middle'>`;
}

/**
 * get user information from various impulse systems
 */
async function getUserProfileData(userid: string) {
	const data: {
		exp?: number,
		level?: number,
		ontime?: number,
		customStatus?: string,
		registrationDate?: string,
		clanName?: string,
		clanRank?: string,
		tcgPoints?: number,
		tcgPointsRank?: number,
		tcgTotalCards?: number,
		tcgTotalCardsRank?: number,
		backgroundType?: 'image' | 'color',
		backgroundValue?: string,
		textColor?: string,
	} = {};

	// fetch all data in parallel for better performance
	const [
		expDoc, profileSettings, userClanInfo, registrationResult, tcgProfile,
	] = await Promise.allSettled([
		ImpulseDB('expdata').findOne({ _id: userid }),
		ProfileSettingsDB.findOne({ _id: userid }),
		UserClans.findOne({ _id: userid }),
		getRegistrationData(userid),
		TcgProfileDB.findOne({ userId: userid }),
	]);

	// process EXP data
	if (expDoc.status === 'fulfilled' && expDoc.value) {
		data.exp = expDoc.value.exp;
		data.level = expDoc.value.level;
	}

	// process ontime data - use the ontime module's function to read from the JSON file
	const ontime = getTotalOntime(userid);
	if (ontime > 0) {
		data.ontime = ontime;
	}

	// process profile settings
	if (profileSettings.status === 'fulfilled' && profileSettings.value) {
		const settings = profileSettings.value;
		if (settings.status) {
			data.customStatus = settings.status;
		}
		if (settings.backgroundType && settings.backgroundValue) {
			data.backgroundType = settings.backgroundType;
			data.backgroundValue = settings.backgroundValue;
		}
		if (settings.textColor) {
			data.textColor = settings.textColor;
		}
	}

	// process clan data
	if (userClanInfo.status === 'fulfilled' && userClanInfo.value?.memberOf) {
		const clanResult = await Clans.findOne({ _id: userClanInfo.value.memberOf }).catch(() => null);
		if (clanResult) {
			data.clanName = clanResult.name;
			const memberData = clanResult.members[userid];
			if (memberData && clanResult.ranks[memberData.rank]) {
				data.clanRank = clanResult.ranks[memberData.rank].name;
			}
		}
	}

	// process registration date from cached result
	if (registrationResult.status === 'fulfilled' && registrationResult.value) {
		const result = registrationResult.value;
		if (result.registertime) {
			const date = new Date(result.registertime * 1000);
			const weekday = date.toLocaleString('en-US', { weekday: 'short' });
			const month = date.toLocaleString('en-US', { month: 'short' });
			const day = String(date.getDate()).padStart(2, '0');
			const year = date.getFullYear();
			data.registrationDate = `${weekday}, ${month} ${day}, ${year}`;
		}
	}

	// process TCG data with rank calculation
	if (tcgProfile.status === 'fulfilled' && tcgProfile.value) {
		const userTcgData = tcgProfile.value;
		data.tcgPoints = userTcgData.collectionPoints || 0;
		data.tcgTotalCards = userTcgData.totalQuantity || 0;

		// calculate ranks by fetching counts of users with higher values
		const [pointsRankResult, cardsRankResult] = await Promise.allSettled([
			TcgProfileDB.countDocuments({ collectionPoints: { $gt: userTcgData.collectionPoints || 0 } }),
			TcgProfileDB.countDocuments({ totalQuantity: { $gt: userTcgData.totalQuantity || 0 } }),
		]);

		if (pointsRankResult.status === 'fulfilled') {
			data.tcgPointsRank = pointsRankResult.value + 1;
		}

		if (cardsRankResult.status === 'fulfilled') {
			data.tcgTotalCardsRank = cardsRankResult.value + 1;
		}
	}

	return data;
}

// format ontime for display
function formatOntime(time: number): string {
	const s = Math.floor((time / 1000) % 60);
	const m = Math.floor((time / (1000 * 60)) % 60);
	const h = Math.floor(time / (1000 * 60 * 60));

	const parts: string[] = [];
	if (h > 0) parts.push(`${h.toLocaleString()} ${h === 1 ? 'hour' : 'hours'}`);
	if (m > 0) parts.push(`${m.toLocaleString()} ${m === 1 ? 'minute' : 'minutes'}`);
	if (parts.length === 0 && s > 0) parts.push(`${s.toLocaleString()} ${s === 1 ? 'second' : 'seconds'}`);
	return parts.length ? parts.join(', ') : '0 seconds';
}

function getStatusDisplay(user: User | null, customStatus?: string): string {
	let statusText = '';

	if (!user?.connected) {
		statusText = `<b style="color: red;">●&nbsp;Offline</b>`;
	} else {
		const statusType = user.statusType || 'online';
		switch (statusType) {
			case 'busy':
				statusText = `<b style="color: orange;">●&nbsp;Busy</b>`;
				break;
			case 'idle':
				statusText = `<b style="color: gray;">●&nbsp;Idle</b>`;
				break;
			case 'online':
			default:
				statusText = `<b style="color: green;">●&nbsp;Online</b>`;
		}
	}

	// append custom status in parentheses if provided
	if (customStatus) {
		statusText += ` - (${Chat.escapeHTML(customStatus)})`;
	}

	return statusText;
}

export const commands: Chat.ChatCommands = {
	uprofile: {
		'': 'view',
		async view(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);
			const targetName = target || user.name;

			// get user profile data
			const profileData = await getUserProfileData(targetId);

			let backgroundStyle = '';
			if (profileData.backgroundType === 'image' && profileData.backgroundValue) {
				// re-validate URL before use in CSS context
				if (isValidImageUrl(profileData.backgroundValue)) {
					const cssUrl = profileData.backgroundValue.replace(/'/g, "\\'");
					backgroundStyle = `background-image: url('${cssUrl}'); background-size: cover; background-position: center;`;
				}
			} else if (profileData.backgroundType === 'color' && profileData.backgroundValue) {
				// re-validate hex color before use in CSS context
				if (isValidHexColor(profileData.backgroundValue)) {
					backgroundStyle = `background-color: ${profileData.backgroundValue};`;
				}
			}

			// build text color style
			let textColorStyle = '';
			if (profileData.textColor && isValidHexColor(profileData.textColor)) {
				textColorStyle = `color: ${profileData.textColor};`;
			}

			// build the profile HTML in table format
			let buf = `<table cellspacing="0" cellpadding="3" style="min-width:100%;min-height:150px;${backgroundStyle}">`;
			buf += '<tr>';

			// avatar section (left side)
			buf += '<td style="width: 80px; text-align: center; border-right: solid 1px black; padding: 12px;">';

			// username in avatar section
			buf += `<div style="text-align: center; padding-bottom: 6px;"><b class="username">${Impulse.nameColor(targetName, true, true)}</b></div>`;

			// avatar image
			buf += `<div style="text-align: center;">${getAvatarDisplay(targetUser)}</div>`;

			buf += '</td>';

			// info section (right side)
			buf += '<td>';

			// status with custom status in brackets (if available)
			buf += `<p style="margin: 4px 0;${textColorStyle}"><u>Status:</u> ${getStatusDisplay(targetUser, profileData.customStatus)}</p>`;

			if (profileData.clanName) {
				buf += `<p style="margin: 4px 0;${textColorStyle}"><u>Clan:</u> <span>${Chat.escapeHTML(profileData.clanName)}`;
				if (profileData.clanRank) {
					buf += ` ( ${Chat.escapeHTML(profileData.clanRank)} )`;
				}
				buf += `</span></p>`;
			}

			// registration date
			if (profileData.registrationDate) {
				buf += `<p style="margin: 4px 0;${textColorStyle}"><u>Registration Date:</u> <span>${profileData.registrationDate}</span></p>`;
			}

			// level (if available)
			if (profileData.level !== undefined) {
				buf += `<p style="margin: 4px 0;${textColorStyle}"><u>Level:</u> <span>${profileData.level}</span></p>`;
			}

			// ontime
			const storedOntime = profileData.ontime ?? 0;
			const currentSessionOntime = getCurrentSessionTime(targetUser);
			const totalOntime = storedOntime + currentSessionOntime;
			if (totalOntime > 0) {
				buf += `<p style="margin: 4px 0;${textColorStyle}"><u>Total Ontime:</u> <span>${formatOntime(totalOntime)}</span></p>`;
			}

			// TCG (if available)
			if (profileData.tcgPoints !== undefined || profileData.tcgTotalCards !== undefined) {
				buf += `<p style="margin: 4px 0;${textColorStyle}"><u>TCG:</u> <span>`;
				const parts: string[] = [];

				if (profileData.tcgPoints !== undefined) {
					let pointsStr = `${profileData.tcgPoints.toLocaleString()} Points`;
					if (profileData.tcgPointsRank !== undefined) {
						pointsStr += ` (#${profileData.tcgPointsRank})`;
					}
					parts.push(pointsStr);
				}

				if (profileData.tcgTotalCards !== undefined) {
					let cardsStr = `${profileData.tcgTotalCards.toLocaleString()} Total Cards`;
					if (profileData.tcgTotalCardsRank !== undefined) {
						cardsStr += ` (#${profileData.tcgTotalCardsRank})`;
					}
					parts.push(cardsStr);
				}

				buf += parts.join(' | ');
				buf += `</span></p>`;
			}

			buf += '</td>';

			buf += '</tr>';
			buf += '</table>';

			this.sendReplyBox(buf);
		},

		async setstatus(target, room, user): Promise<void> {
			if (!target || target.length > 50) {
				return this.errorReply("Please provide a status message (max 50 characters).");
			}

			await ProfileSettingsDB.updateOne(
				{ _id: user.id },
				{ $set: { status: target, updatedAt: new Date() }, $setOnInsert: { _id: user.id } },
				{ upsert: true }
			);

			this.sendReply(`Your profile status has been set to: "${target}"`);
		},

		async clearstatus(target, room, user): Promise<void> {
			await ProfileSettingsDB.updateOne(
				{ _id: user.id },
				{ $unset: { status: '' }, $set: { updatedAt: new Date() } }
			);
			this.sendReply("Your profile status has been cleared.");
		},

		async setbg(target, room, user): Promise<void> {
			if (!target) {
				return this.errorReply("Please provide an image URL or hex color code (e.g., /uprofile setbg #FF5733 or /uprofile setbg https://example.com/image.png).");
			}

			const value = target.trim();

			// check if it's a hex color code
			if (isValidHexColor(value)) {
				await ProfileSettingsDB.updateOne(
					{ _id: user.id },
					{
						$set: { backgroundType: 'color', backgroundValue: value, updatedAt: new Date() },
						$setOnInsert: { _id: user.id },
					},
					{ upsert: true }
				);
				this.sendReply(`Your profile background has been set to color: ${value}`);
				return;
			}

			// check if it's a valid image URL
			if (isValidImageUrl(value)) {
				await ProfileSettingsDB.updateOne(
					{ _id: user.id },
					{
						$set: { backgroundType: 'image', backgroundValue: value, updatedAt: new Date() },
						$setOnInsert: { _id: user.id },
					},
					{ upsert: true }
				);
				this.sendReply(`Your profile background has been set to image: ${value}`);
				return;
			}

			return this.errorReply("Invalid input. Please provide a valid hex color code (e.g., #FF5733) or an image URL ending with a valid image extension (.png, .jpg, .jpeg, .gif, .webp).");
		},

		async clearbg(target, room, user): Promise<void> {
			await ProfileSettingsDB.updateOne(
				{ _id: user.id },
				{ $unset: { backgroundType: '', backgroundValue: '' }, $set: { updatedAt: new Date() } }
			);
			this.sendReply("Your profile background has been cleared.");
		},

		async settextcolor(target, room, user): Promise<void> {
			if (!target) {
				return this.errorReply("Please provide a hex color code (e.g., /uprofile settextcolor #FF5733).");
			}

			const value = target.trim();

			if (!isValidHexColor(value)) {
				return this.errorReply("Invalid hex color code. Please provide a valid hex color (e.g., #FF5733 or #FFF).");
			}

			await ProfileSettingsDB.updateOne(
				{ _id: user.id },
				{ $set: { textColor: value, updatedAt: new Date() }, $setOnInsert: { _id: user.id } },
				{ upsert: true }
			);
			this.sendReply(`Your profile text color has been set to: ${value}`);
		},

		async cleartextcolor(target, room, user): Promise<void> {
			await ProfileSettingsDB.updateOne(
				{ _id: user.id },
				{ $unset: { textColor: '' }, $set: { updatedAt: new Date() } }
			);
			this.sendReply("Your profile text color has been cleared.");
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/uprofile [user]", desc: "View a user's profile with avatar, stats, and information." },
				{ cmd: "/uprofile setstatus [message]", desc: "Set a custom status message on your profile (max 50 characters)." },
				{ cmd: "/uprofile clearstatus", desc: "Clear your custom profile status." },
				{ cmd: "/uprofile setbg [url/color]", desc: "Set profile background to an image URL or hex color (e.g., #FF5733)." },
				{ cmd: "/uprofile clearbg", desc: "Clear your custom profile background." },
				{
					cmd: "/uprofile settextcolor [color]",
					desc: "Set profile text color to a hex color (e.g., #FF5733). Does not affect username or status.",
				},
				{ cmd: "/uprofile cleartextcolor", desc: "Clear your custom profile text color." },
			];
			const html = `<center><strong>User Profile Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},

	uprofilehelp(): void { this.parse('/uprofile help'); },
};
