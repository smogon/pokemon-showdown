export const Rulesets: {[k: string]: ModdedFormatData} = {
	obtainablemoves: {
		inherit: true,
		banlist: [
			// No valid fathers and can't get in Grand Underground
			'Taillow + Boomburst', 'Swellow + Boomburst',
			'Chatot + Boomburst',
		],
	},
};
