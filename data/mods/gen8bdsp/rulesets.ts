export const Rulesets: {[k: string]: ModdedFormatData} = {
	obtainablemoves: {
		inherit: true,
		banlist: [
			// No valid fathers and can't get in Grand Underground
			'Taillow + Boomburst', 'Swellow + Boomburst',
			'Plusle + Tearful Look',
			'Minun + Tearful Look',
			'Luvdisc + Heal Pulse',
			'Starly + Detect', 'Staravia + Detect', 'Staraptor + Detect',
			'Chatot + Boomburst', 'Chatot + Encore',
			'Spiritomb + Foul Play',
			'Munchlax + Power-Up Punch', 'Snorlax + Power-Up Punch',
		],
	},
};
