export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	commander: {
		inherit: true,
		flags: { inherit: true, cantsuppress: 1 },
	},
	gulpmissile: {
		inherit: true,
		flags: { inherit: true, failroleplay: 0, failskillswap: 0, noentrain: 0, noreceiver: 0, notrace: 0 },
	},
	hadronengine: {
		inherit: true,
		flags: {
			inherit: true,
			cantsuppress: 1, failroleplay: 1, failskillswap: 1, noentrain: 1, noreceiver: 1, notrace: 1, notransform: 1,
		},
	},
	illuminate: {
		inherit: true,
		onTryBoost: undefined, // no inherit
		onModifyMove: undefined, // no inherit
		flags: { inherit: true, breakable: 0 },
		rating: 0,
	},
	mindseye: {
		inherit: true,
		isNonstandard: "Future",
	},
	orichalcumpulse: {
		inherit: true,
		flags: {
			inherit: true,
			cantsuppress: 1, failroleplay: 1, failskillswap: 1, noentrain: 1, noreceiver: 1, notrace: 1, notransform: 1,
		},
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
	embodyaspectcornerstone: {
		inherit: true,
		isNonstandard: "Future",
	},
	embodyaspecthearthflame: {
		inherit: true,
		isNonstandard: "Future",
	},
	embodyaspectteal: {
		inherit: true,
		isNonstandard: "Future",
	},
	embodyaspectwellspring: {
		inherit: true,
		isNonstandard: "Future",
	},
};
