import { Battle } from './battle';
import { BattleStream } from './battle-stream';
import { Dex } from './dex';
import { Teams } from './teams';

const GAME_TYPES = ['singles', 'doubles', 'triples', 'multi', 'freeforall'];

class EngineBattle extends Battle {
	override setPlayer(slot: SideID, options: PlayerOptions) {
		const slots = ['p1', 'p2', 'p3', 'p4'].slice(0, this.format.playerCount);
		if (!slots.includes(slot)) throw new Error(`Invalid player slot ${slot} for ${this.gameType}`);
		if (!this.sides[slots.indexOf(slot)] && !options?.team) {
			throw new Error(`Player ${slot} requires an explicit team`);
		}
		super.setPlayer(slot, options);
	}

	override getTeam(options: PlayerOptions) {
		const team = typeof options.team === 'string' ? Teams.unpack(options.team) : options.team;
		if (!Array.isArray(team) || !team.length) throw new Error('Expected a nonempty explicit team');
		return team;
	}
}

/** Runs a battle configured by the host, with teams supplied by the host. */
export class EngineBattleStream extends BattleStream {
	protected override createBattle(options: ConstructorParameters<typeof Battle>[0]) {
		const rawFormat: unknown = options.format;
		if (!rawFormat || typeof rawFormat !== 'object' || Array.isArray(rawFormat)) {
			throw new Error('Expected an explicit battle format in >start');
		}
		const { name, mod, gameType, ruleset, gen } = rawFormat as Record<string, unknown>;
		if (typeof mod !== 'string' || !Object.hasOwn(Dex.dexes, mod)) {
			throw new Error('Expected a known Dex mod in the battle format');
		}
		if (typeof gameType !== 'string' || !GAME_TYPES.includes(gameType)) {
			throw new Error('Expected a supported gameType in the battle format');
		}
		if (!Array.isArray(ruleset) || ruleset.some(rule => typeof rule !== 'string')) {
			throw new Error('Expected a ruleset array of strings in the battle format');
		}
		if (name !== undefined && (typeof name !== 'string' || !Dex.toID(name))) {
			throw new Error('Expected a valid name in the battle format');
		}
		if (gen !== undefined && gen !== Dex.mod(mod).gen) {
			throw new Error('Battle format generation must match its Dex mod');
		}

		const formatData = { name: name ?? `Orbisforge ${gameType}`, mod, gameType, ruleset, effectType: 'Format' };
		const format = new Dex.Format(formatData);
		const battle = new EngineBattle({ ...options, format, formatid: format.id });
		// Replay through this stream with the same rules, even when the format has no catalog entry.
		const start = battle.inputLog.findIndex(line => line.startsWith('>start '));
		const startOptions = JSON.parse(battle.inputLog[start].slice('>start '.length));
		battle.inputLog[start] = `>start ${JSON.stringify({ ...startOptions, format: formatData })}`;
		return battle;
	}
}
