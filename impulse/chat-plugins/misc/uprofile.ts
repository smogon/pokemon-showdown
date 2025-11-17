/*
 * Pokemon Showdown
 * User Profile Command
 * @author MusaddikTemkar
 */

import { nameColor } from '../../colors';
import { ImpulseDB } from '../../impulse-db';

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-server.fun/avatars/';

/**
 * Get the avatar display for a user, including custom avatars
 */
function getAvatarDisplay(user: User): string {
	const avatar = user.avatar;
	let avatarUrl = '';

	// Check if user has a custom avatar
	if (avatar && typeof avatar === 'string' && avatar.includes('.')) {
		// Custom avatar from config/avatars/
		avatarUrl = `${getAvatarBaseUrl()}${avatar}?v=${Date.now()}`;
	} else {
		// Use the server's avatar system for official/custom avatars
		if (Chat.plugins.avatars?.Avatars?.src) {
			avatarUrl = Chat.plugins.avatars.Avatars.src(avatar || 'unknown');
		} else {
			// Fallback to default sprite URL
			const avatarName = typeof avatar === 'string' ? avatar : (typeof avatar === 'number' ? `trainer-${avatar}` : 'unknown');
			avatarUrl = `https://${Config.routes.client}/sprites/trainers/${avatarName}.png`;
		}
	}

	return `<img src='${avatarUrl}' width='80' height='80' class='pixelated' style='vertical-align:middle'>`;
}

/**
 * Get user information from various Impulse systems
 */
async function getUserProfileData(userid: string) {
	const data: {
		exp?: number,
		level?: number,
		ontime?: number,
	} = {};

	// Get EXP data if available
	try {
		const expDoc = await ImpulseDB('expdata').findOne({ _id: userid });
		if (expDoc) {
			data.exp = expDoc.exp;
			data.level = expDoc.level;
		}
	} catch {
		// EXP system not available
	}

	// Get ontime data if available
	try {
		const ontimeDoc = await ImpulseDB('ontime').findOne({ _id: userid });
		if (ontimeDoc) {
			data.ontime = ontimeDoc.ontime;
		}
	} catch {
		// Ontime system not available
	}

	return data;
}

/**
 * Format ontime for display
 */
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

export const commands: Chat.ChatCommands = {
	uprofile: {
		'': 'view',
		async view(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);
			const targetName = target || user.name;

			// Get user profile data
			const profileData = await getUserProfileData(targetId);

			// Build the profile HTML
			let buf = '<div class="infobox">';

			// Header with avatar and name
			buf += '<div style="text-align:center;margin-bottom:10px;">';
			if (targetUser) {
				buf += getAvatarDisplay(targetUser);
			}
			buf += `<br><strong style="font-size:18px;">${nameColor(targetName, true, true)}</strong>`;
			buf += '</div>';

			// Profile information
			buf += '<div style="text-align:left;padding:0 10px;">';

			// Status
			if (targetUser) {
				buf += `<strong>Status:</strong> <span style="color:green;">● Online</span><br>`;
			} else {
				buf += `<strong>Status:</strong> <span style="color:gray;">○ Offline</span><br>`;
			}

			// User ID
			buf += `<strong>User ID:</strong> ${targetId}<br>`;

			// Level and EXP (if available)
			if (profileData.level !== undefined) {
				buf += `<strong>Level:</strong> ${profileData.level}<br>`;
			}
			if (profileData.exp !== undefined) {
				buf += `<strong>EXP:</strong> ${profileData.exp.toLocaleString()}<br>`;
			}

			// Ontime (if available)
			if (profileData.ontime !== undefined) {
				let totalOntime = profileData.ontime;
				// Add current session time if user is online
				if (targetUser?.connected && targetUser.lastConnected) {
					totalOntime += Date.now() - targetUser.lastConnected;
				}
				buf += `<strong>Total Ontime:</strong> ${formatOntime(totalOntime)}<br>`;
			}

			// Global rank (if available)
			if (targetUser && Config.groups[targetUser.tempGroup]?.name) {
				buf += `<strong>Global Rank:</strong> ${Config.groups[targetUser.tempGroup].name} (${targetUser.tempGroup})<br>`;
			}

			// Registration status
			if (targetUser) {
				if (targetUser.registered) {
					buf += `<strong>Registered:</strong> Yes<br>`;
				} else {
					buf += `<strong>Registered:</strong> No<br>`;
				}
			}

			buf += '</div>';
			buf += '</div>';

			this.sendReplyBox(buf);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/uprofile [user]", desc: "View a user's profile with avatar, stats, and information." },
			];
			const html = `<center><strong>User Profile Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Note: Named 'uprofile' to avoid conflicts with the existing /profile command.</small>`;
			this.sendReplyBox(html);
		},
	},

	uprofilehelp(): void { this.parse('/uprofile help'); },
};
