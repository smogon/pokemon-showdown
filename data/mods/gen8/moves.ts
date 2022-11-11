export const Moves: {[k: string]: ModdedMoveData} = {
	auroraveil: {
		inherit: true,
		onTry() {
			return this.field.isWeather('hail');
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather('hail')) move.accuracy = true;
		},
	},
	hail: {
		inherit: true,
		isNonstandard: null,
	},
	maxairstream: {
		inherit: true,
		isNonstandard: null,
	},
	maxdarkness: {
		inherit: true,
		isNonstandard: null,
	},
	maxflare: {
		inherit: true,
		isNonstandard: null,
	},
	maxflutterby: {
		inherit: true,
		isNonstandard: null,
	},
	maxgeyser: {
		inherit: true,
		isNonstandard: null,
	},
	maxguard: {
		inherit: true,
		isNonstandard: null,
	},
	maxhailstorm: {
		inherit: true,
		isNonstandard: null,
	},
	maxknuckle: {
		inherit: true,
		isNonstandard: null,
	},
	maxlightning: {
		inherit: true,
		isNonstandard: null,
	},
	maxmindstorm: {
		inherit: true,
		isNonstandard: null,
	},
	maxooze: {
		inherit: true,
		isNonstandard: null,
	},
	maxovergrowth: {
		inherit: true,
		isNonstandard: null,
	},
	maxphantasm: {
		inherit: true,
		isNonstandard: null,
	},
	maxquake: {
		inherit: true,
		isNonstandard: null,
	},
	maxrockfall: {
		inherit: true,
		isNonstandard: null,
	},
	maxstarfall: {
		inherit: true,
		isNonstandard: null,
	},
	maxsteelspike: {
		inherit: true,
		isNonstandard: null,
	},
	maxstrike: {
		inherit: true,
		isNonstandard: null,
	},
	maxwyrmwind: {
		inherit: true,
		isNonstandard: null,
	},
};
