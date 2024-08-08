/**
 * Tools for managing the Draft Factory database.
 * 
 * @author MathyFurret
 */

import {SQL, Net} from "../../lib";
import {Teams} from "../../sim";

interface DraftPokemonSet extends Partial<PokemonSet> {
	teraCaptain?: boolean;
}

/**
 * Given a PokePaste URL, outputs the URL to access the raw text.
 * 
 * This assumes the URL given is either a normal PokePaste URL or already a URL to the raw text.
 */
function getRawURL(url: string): string {
	if (url.endsWith('/raw')) return url;
	return url + '/raw';
}

/**
 * Given a Showdown team export, prepares a stringified JSON of the team.
 * Handles extensions used in Draft, such as marking Tera Captains.
 */
function prepareTeamJSON(paste: string): string {
	const sets: DraftPokemonSet[] | null = Teams.import(paste);
	if (!sets) throw new Error("Could not parse paste");
	for (const set of sets) {
		if (set.name === "Tera Captain") {
			set.name = '';
			set.teraCaptain = true;
		}
	}
	return JSON.stringify(sets);
}

class DraftFactoryDB {
	db?: SQL.DatabaseManager;
	ready: boolean;

	constructor() {
		this.ready = false;
		if (!Config.usesqlite) return;
		this.db = SQL(module, {
			file: './databases/draft-factory.db',
		});
		void this.setupDatabase();
	}

	async setupDatabase() {
		if (!this.db) return;
		await this.db.runFile('./databases/schemas/draft-factory.sql');
		this.ready = true;
	}

	async getSourcesCount(): Promise<{source: string, count: number}[]> {
		if (!this.db || !this.ready) return [];
		return this.db.all(`SELECT * FROM draftfactory_sources_count`);
	}

	/**
	 * Loads an external CSV file containing PokePaste URLs and adds teams to the database.
	 * Associates the teams with a source named `sourceName`.
	 * 
	 * A line in the wrong format will cause a rollback.
	 * An HTTP error or team parsing error will simply skip the line.
	 */
	async loadCSV(url: string, sourceName: ID): Promise<Error[]> {
		if (!this.db || !this.ready) throw new Chat.ErrorMessage("Can't load teams; the DB isn't ready");
		await this.db.run(`BEGIN`);
		try {
			await this.db.run(`INSERT INTO draftfactory_sources (id, source_url) VALUES (?, ?)`, [sourceName, url]);
			const insertStatement = await this.db.prepare(`INSERT OR ABORT INTO gen9draftfactory (source, url1, team1, url2, team2) VALUES (?, ?, ?, ?, ?)`);
			if (!insertStatement) throw new Chat.ErrorMessage("Couldn't parse the insert statement");
			const stream = Net(url).getStream();
			let line: string | null;
			let skipHeader = true;
			const pendingAdds = [];
			const errors: Error[] = [];
			while ((line = await stream.readLine()) !== null) {
				if (skipHeader) {
					skipHeader = false;
					continue;
				}
				if (!line.trim()) continue;
				// player1 name, team url, pokemon, pokemon, player2 name, team url, pokemon, pokemon
				const [, url1, , , , url2] = line.split(',');
				if (!url1 || !url2) throw new Chat.ErrorMessage("Unexpected format");
				const requests = [Net(getRawURL(url1)).get(), Net(getRawURL(url2)).get()];
				// pendingRequests.push(...requests);
				pendingAdds.push((async () => {
					try {
						let [paste1, paste2] = await Promise.all(requests);
						paste1 = prepareTeamJSON(paste1);
						paste2 = prepareTeamJSON(paste2);
						await insertStatement.run([sourceName, url1, paste1, url2, paste2]);
					} catch (e: any) {
						errors.push(e);
					}
				})());
			}
			await Promise.all(pendingAdds);
			await this.db.run(`COMMIT`);
			return errors;
		} catch (e) {
			await this.db.run(`ROLLBACK`);
			throw e;
		}
	}

	async deleteSource(sourceName: ID) {
		if (!this.db || !this.ready) throw new Error("The DB isn't ready");
		await this.db.run(`DELETE FROM draftfactory_sources WHERE id = ?`, [sourceName]);
	}
}

async function setupDatabase(database: SQL.DatabaseManager) {
	await database.runFile('./databases/schemas/draft-factory.sql');
}

const db: DraftFactoryDB | null = Config.usesqlite ? new DraftFactoryDB() : null;

const WHITELIST = ['mathy'];

function check(ctx: Chat.CommandContext) {
	if (!WHITELIST.includes(ctx.user.id)) ctx.checkCan('rangeban');
	if (!db) throw new Chat.ErrorMessage(`This feature is not supported because SQLite is disabled.`);
}

export const commands: Chat.ChatCommands = {
	draftfactory: {
		async import(target) {
			check(this);
			const args = target.split(',');
			if (args.length !== 2) throw new Chat.ErrorMessage(`This command takes exactly 2 arguments.`);
			const url = args[0].trim();
			const label = toID(args[1]);
			const errors = await db!.loadCSV(url, label);
			if (errors.length) {
				this.errorReply(`Encountered ${errors.length} ${Chat.plural(errors, 'error')}; other sets imported successfully.`);
			} else {
				this.sendReply(`All sets imported successfully.`);
			}
		},
		importhelp: [
			`/draftfactory import url, label - Imports a CSV of Draft Factory teams from the given URL.`,
			`The teams will be associated with a label (must be unique); you can delete teams from this label with /draftfactory delete.`,
		],
		async delete(target) {
			check(this);
			db!.deleteSource(toID(target));
		},
	},
	draftfactoryhelp: [
		`/draftfactory import url, label - Imports a CSV of Draft Factory teams from the given URL.`,
		`/draftfactory delete label - Deletes all teams under the name "label"`,
		`Requires: &`,
	],
};
