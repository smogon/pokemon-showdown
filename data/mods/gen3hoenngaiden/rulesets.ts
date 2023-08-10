export const Rulesets: {[k: string]: ModdedFormatData} = {
	batonpassmod: {
		effectType: 'Rule',
		name: 'Baton Pass Mod',
		desc: "Positive stat boosts are reset upon using Baton Pass.",
		onBegin() {
			this.add('rule', 'Baton Pass Mod: Positive stat boosts are reset upon using Baton Pass');
		},
		onHit(source, target, move) {
			if (source.positiveBoosts() && move.id === 'batonpass') {
				this.add('-clearpositiveboost', source);
				this.hint("Baton Pass Mod activated: Stat Boosts cannot be passed");
			}
		},
	},
	hoenngaidenmod: {
		effectType: 'Rule',
		name: 'Hoenn Gaiden Mod',
		desc: 'At the start of a battle, gives each player a link to the Hoenn Gaiden thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add(`raw|<img src="https://cdn.discordapp.com/attachments/510822010922860545/864665757446045716/Hoenn_Gaiden_Banner.png" height="213" width="381">`);
			this.add('-message', `Welcome to Hoenn Gaiden!`);
			this.add('-message', `This is a [Gen 3] OU-based format where we add later generation Pokemon, items, moves, and abilities, as well as change up existing ones!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/hoenn-gaiden-pet-mod-of-the-season-slate-8-concept-voting.3681339/`);
		},
	},
	hgstandard: {
		effectType: 'ValidatorRule',
		name: 'HG Standard',
		desc: "The standard ruleset for all Hoenn Gaiden tiers.",
		ruleset: [
			'Obtainable', 'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
			'Hoenn Gaiden Mod', 'Deoxys Camouflage Clause', 'Baton Pass Mod',
		],
		banlist: [
			'Armaldo + Rapid Spin + Knock Off',
			'Kabutops + Rapid Spin + Knock Off',
			'Skarmory + Whirlwind + Drill Peck',
			'Weavile + Calm Mind',
		],
	},
};
