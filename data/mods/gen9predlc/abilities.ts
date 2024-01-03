export const Abilities: {[k: string]: ModdedAbilityData} = {
	commander: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1},
	},
	gulpmissile: {
		inherit: true,
		flags: {cantsuppress: 1, notransform: 1},
	},
	hadronengine: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1},
	},
	illuminate: {
		inherit: true,
		onTryBoost() {},
		onModifyMove() {},
		flags: {},
		rating: 0,
	},
	mindseye: {
		inherit: true,
		isNonstandard: "Future",
	},
	orichalcumpulse: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1},
	},
	supersweetsyrup: {
		inherit: true,
		isNonstandard: "Future",
	},
	hospitality: {
		inherit: true,
		isNonstandard: "Future",
	},
	toxicchain: {
		inherit: true,
		isNonstandard: "Future",
	},
	embodyaspect: {
		inherit: true,
		isNonstandard: "Future",
	},
};
