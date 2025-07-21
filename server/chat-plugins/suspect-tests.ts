import { Utils } from '../../lib';
import { FS } from '../../lib/fs';

const SUSPECTS_FILE = 'config/suspects.json';

interface SuspectTest {
	tier: string;
	suspect: string;
	date: string;
	url: string;
}

interface SuspectsFile {
	whitelist: string[];
	suspects: { [format: string]: SuspectTest };
}

export let suspectTests: SuspectsFile = JSON.parse(FS(SUSPECTS_FILE).readIfExistsSync() || "{}");

export function saveSuspectTests() {
	FS(SUSPECTS_FILE).writeUpdate(() => JSON.stringify(suspectTests));
}

const defaults: SuspectsFile = {
	whitelist: [],
	suspects: {},
};

if (!suspectTests.whitelist && !suspectTests.suspects) {
	const suspects = { ...suspectTests } as unknown as { [format: string]: SuspectTest };
	suspectTests = { ...defaults, suspects };
	saveSuspectTests();
}

function checkPermissions(context: Chat.CommandContext) {
	const user = context.user;
	if (suspectTests.whitelist?.includes(user.id)) return true;
	context.checkCan('gdeclare');
}

function validateDate(date: string) {
	const [month, day] = date.trim().split(date.includes('-') ? '-' : '/');
	const isValidMonth = /(0[1-9]|1[0-2])/.test(month);
	if (!isValidMonth) {
		throw new Chat.ErrorMessage(`${month} is not a valid month; valid options are: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12`);
	}
	const dayRegex = new RegExp(
		`(0[1-9]|[12][0-9]${month !== '02' ? `|3${/(01|0[3578]|1[02])/.test(month) ? '[01]' : '0'})` : ``}`
	);
	const isValidDate = isValidMonth && dayRegex.test(day);
	if (!isValidDate) throw new Chat.ErrorMessage("Dates must be in the format MM/DD.");
	return `${month}/${day}`;
}

export const commands: Chat.ChatCommands = {
	suspect: 'suspects',
	suspects: {
		''(target, room, user) {
			const suspects = suspectTests.suspects;
			if (!Object.keys(suspects).length) {
				throw new Chat.ErrorMessage("There are no suspect tests running.");
			}
			if (!this.runBroadcast()) return;

			let buffer = '<strong>Suspect tests currently running:</strong>';
			for (const i of Object.keys(suspects)) {
				const test = suspects[i];
				buffer += '<br />';
				buffer += `${Utils.escapeHTML(test.tier)}: <a href="${test.url}">${Utils.escapeHTML(test.suspect)}</a> (${test.date})`;
			}
			return this.sendReplyBox(buffer);
		},

		async add(target, room, user) {
			checkPermissions(this);

			const [tier, suspect, date, ...reqs] = target.split(',').map(x => x.trim());
			if (!(tier && suspect && date && reqs)) {
				return this.parse('/help suspects');
			}

			const format = Dex.formats.get(tier);
			if (format.effectType !== 'Format') throw new Chat.ErrorMessage(`"${tier}" is not a valid tier.`);
			if (format.id in suspectTests.suspects) {
				return this.parse(`/help suspects`);
			}

			const suspectString = suspect.trim();
			const dateActual = validateDate(date);

			const reqData: Record<string, number> = {};
			if (!reqs.length) {
				throw new Chat.ErrorMessage("At least one requirement for qualifying must be provided.");
			}
			for (const req of reqs) {
				let [k, v] = req.split('=');
				k = toID(k);
				if (k === 'b') {
					await this.parse(`/suspects setcoil ${format},${v}`);
					continue;
				}
				if (!['elo', 'gxe', 'coil'].includes(k)) {
					throw new Chat.ErrorMessage(`Invalid requirement type: ${k}. Must be 'coil', 'gxe', or 'elo'.`);
				}
				if (k === 'coil' && !reqs.some(x => toID(x).startsWith('b'))) {
					throw new Chat.ErrorMessage("COIL reqs are specified, but you have not provided a B value (with the argument `b=num`)");
				}
				const val = Number(v);
				if (isNaN(val) || val < 0) {
					throw new Chat.ErrorMessage(`Invalid value: ${v}`);
				}
				if (reqData[k]) {
					throw new Chat.ErrorMessage(`Requirement type ${k} specified twice.`);
				}
				reqData[k] = val;
			}
			const [out, error] = await LoginServer.request(suspectTests.suspects[format.id] ? "suspects/edit" : "suspects/add", {
				format: format.id,
				reqs: JSON.stringify(reqData),
			});
			if (out?.actionerror || error) {
				throw new Chat.ErrorMessage("Error adding suspect test: " + (out?.actionerror || error?.message));
			}

			// Safeguard to prevent potential race conditions
			if (!suspectTests.suspects[format.id]) {
				suspectTests.suspects[format.id] = {
					tier: format.name,
					suspect: suspectString,
					date: dateActual,
					url: out.url,
				};
			}
			saveSuspectTests();

			this.privateGlobalModAction(`${user.name} added a ${format.name} suspect test.`);
			this.globalModlog('SUSPECTTEST', null, `added ${format.name}`);

			this.sendReply(`Added a suspect test notice for ${suspectString} in ${format.name}.`);
			if (reqData.coil && !reqData.b) {
				this.sendReply('Remember to add a B value for your test\'s COIL setting with /suspects setbvalue.');
			}
		},

		edit(target, room, user) {
			checkPermissions(this);
			// Not dealing with b value/elo/gxe/coil right now
			const [tier, ...targets] = target.split(',').map(x => x.trim());
			if (!(tier && targets.length)) return this.parse(`/help suspects`);

			const format = Dex.formats.get(tier);
			if (format.effectType !== 'Format') throw new Chat.ErrorMessage(`"${tier}" is not a valid tier.`);
			if (!suspectTests.suspects[format.id]) throw new Chat.ErrorMessage(`"${tier}" does not have a suspect test running.`);

			const { date, url, suspect } = suspectTests.suspects[format.id];

			const newInfo: SuspectTest = { date, url, suspect, tier };
			for (const req of target.split(',')) {
				let [k, v] = req.trim().split('=');
				k = toID(k);
				if (k === 'date') {
					const newDate = validateDate(v);
					newInfo.date = newDate;
					continue;
				}
				if (k === 'suspect') {
					const suspectString = v.trim();
					newInfo.suspect = suspectString;
					continue;
				}
				if (k === 'url') {
					const urlString = v.trim();
					if (!/https:\/\/tools\/suspects\/view\/\d+/.test(urlString)) {
						this.errorReply(`"${urlString}" is not a valid error message.`);
						continue;
					}
					newInfo.url = urlString;
					continue;
				}
			}

			let key: keyof SuspectTest;
			const changedKeys: (keyof SuspectTest)[] = [];
			for (key in newInfo) {
				if (suspectTests.suspects[format.id][key] !== newInfo[key]) {
					suspectTests.suspects[format.id][key] = newInfo[key];
					changedKeys.push(key);
				}
			}
			saveSuspectTests();

			this.privateGlobalModAction(`${user.name} edited the ${format.name} suspect test.`);
			this.globalModlog('SUSPECTTEST', null, `edited ${format.id}: ${changedKeys.map(x => `${x}=${newInfo[x]}`).join(', ')}`);
		},

		end: 'remove',
		delete: 'remove',
		async remove(target, room, user) {
			checkPermissions(this);

			const format = toID(target);
			const test = suspectTests.suspects[format];
			if (!test) throw new Chat.ErrorMessage(`There is no suspect test for '${target}'. Check spelling?`);

			const [out, error] = await LoginServer.request('suspects/end', {
				format,
			});
			if (out?.actionerror || error) {
				throw new Chat.ErrorMessage(`Error ending suspect: ${out?.actionerror || error?.message}`);
			}

			this.privateGlobalModAction(`${user.name} removed the ${test.tier} suspect test.`);
			this.globalModlog('SUSPECTTEST', null, `removed ${test.tier}`);

			delete suspectTests.suspects[format];
			saveSuspectTests();
			this.sendReply(`Removed a suspect test notice for ${test.suspect} in ${test.tier}.`);
			this.sendReply(`Remember to remove COIL settings with /suspects deletecoil if you had them enabled.`);
		},

		whitelist(target, room, user) {
			this.checkCan('gdeclare');

			const userid = toID(target);

			if (!userid || userid.length > 18) {
				if (suspectTests.whitelist.length) {
					this.sendReplyBox(`Current users with /suspects access: <username>${suspectTests.whitelist.join('</username>, <username>')}</username>`);
				}
				return this.parse(`/help suspects`);
			}

			if (suspectTests.whitelist.includes(userid)) {
				throw new Chat.ErrorMessage(`${userid} is already whitelisted to add suspect tests.`);
			}

			this.privateGlobalModAction(`${user.name} whitelisted ${userid} to add suspect tests.`);
			this.globalModlog('SUSPECTTEST', null, `whitelisted ${userid}`);

			suspectTests.whitelist.push(userid);
			saveSuspectTests();
		},

		unwhitelist(target, room, user) {
			this.checkCan('gdeclare');

			const userid = toID(target);

			if (!userid || userid.length > 18) {
				return this.parse(`/help suspects`);
			}

			const index = suspectTests.whitelist.indexOf(userid);

			if (index < 0) {
				throw new Chat.ErrorMessage(`${userid} is not whitelisted to add suspect tests.`);
			}

			this.privateGlobalModAction(`${user.name} unwhitelisted ${userid} from adding suspect tests.`);
			this.globalModlog('SUSPECTTEST', null, `unwhitelisted ${userid}`);

			suspectTests.whitelist.splice(index, 1);
			saveSuspectTests();
		},

		async verify(target, room, user) {
			const formatid = toID(target);
			if (!suspectTests.suspects[formatid]) {
				throw new Chat.ErrorMessage("There is no suspect test running for the given format.");
			}
			const [out, error] = await LoginServer.request("suspects/verify", {
				formatid,
				userid: user.id,
			});
			if (error) {
				throw new Chat.ErrorMessage("Error verifying for suspect: " + error.message);
			}
			if (out?.actionerror) {
				throw new Chat.ErrorMessage(out.actionerror);
			}
			this.sendReply(
				out.result ?
					`You have successfully verified for the ${formatid} suspect test.` :
					`You could not verify for the ${formatid} suspect test, as you do not meet the requirements.`
			);
		},

		help() {
			return this.parse('/help suspects');
		},

		deletebvalue: 'setbvalue',
		deletecoil: 'setbvalue',
		sbv: 'setbvalue',
		dbv: 'setbvalue',
		sc: 'setbvalue',
		dc: 'setbvalue',
		setcoil: 'setbvalue',
		async setbvalue(target, room, user, connection, cmd) {
			checkPermissions(this);
			if (!toID(target)) {
				return this.parse(`/help ${cmd}`);
			}
			const [formatStr, source] = this.splitOne(target);
			const format = Dex.formats.get(formatStr);
			let bVal: number | undefined = parseFloat(source);
			if (cmd.startsWith('d')) {
				bVal = undefined;
			} else if (!source || isNaN(bVal) || bVal < 1) {
				throw new Chat.ErrorMessage(`Specify a valid COIL B value.`);
			}
			if (!toID(formatStr) || !format.exists) {
				throw new Chat.ErrorMessage(`Specify a valid format to set a COIL B value for. Check spelling?`);
			}
			this.sendReply(`Updating...`);
			const [res, error] = await LoginServer.request('updatecoil', {
				format: format.id,
				coil_b: bVal,
			});
			if (error) {
				throw new Chat.ErrorMessage(error.message);
			}
			if (!res || res.actionerror) {
				throw new Chat.ErrorMessage(res?.actionerror || "The loginserver is currently disabled.");
			}
			this.globalModlog(`${source ? 'SET' : 'REMOVE'}BVALUE`, null, `${format.id}${bVal ? ` to ${bVal}` : ""}`);
			this.addGlobalModAction(
				`${user.name} ${bVal ? `set B value for ${format.name} to ${bVal}` : `removed B value for ${format.name}`}.`
			);
			if (source) {
				return this.sendReply(`COIL B value for ${format.name} set to ${bVal}.`);
			} else {
				return this.sendReply(`Removed COIL B value for ${format.name}.`);
			}
		},
		setbvaluehelp: [
			`/suspects setbvalue OR /suspects sbv [formatid], [B value] - Activate COIL ranking for the given [formatid] with the given [B value].`,
			`Requires: suspect whitelist ~`,
		],
	},

	suspectshelp() {
		this.sendReplyBox(
			`Commands to manage suspect tests:<br />` +
			`<code>/suspects</code>: displays currently running suspect tests.<br />` +
			`<code>/suspects add [tier], [suspect], [date], [...reqs]</code>: adds a suspect test. Date in the format MM/DD. ` +
			`Reqs in the format [key]=[value], where valid keys are 'coil', 'elo', and 'gxe', delimited by commas. At least one is required.<br />` +
			`(note that if you are using COIL, you must set a B value independently with <code>/suspects setcoil</code>).<br />` +
			`<code>/suspects edit [tier], [key]=[value]</code>: edits an ongoing suspect test. Currently accepted keys are date, url, and suspect.<br />` +
			`<code>/suspects remove [tier]</code>: deletes a suspect test.<br />` +
			`<code>/suspects whitelist [username]</code>: allows [username] to add suspect tests. Requires: ~<br />` +
			`<code>/suspects unwhitelist [username]</code>: disallows [username] from adding suspect tests. Requires: ~<br />` +
			`<code>/suspects setbvalue OR /suspects sbv [formatid], [B value]</code>: Activate COIL ranking for the given [formatid] with the given [B value].<br />` +
			`Requires: suspect whitelist unless stated otherwise`
		);
	},
};
