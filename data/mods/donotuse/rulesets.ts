export const Rulesets: {[k: string]: ModdedFormatData} = {
	donotusemod: {
		effectType: 'Rule',
		name: 'Do Not Use Mod',
		desc: 'At the start of a battle, gives each player a link to the Do Not Use thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add('-message', `Welcome to Do Not Use!`);
			this.add('-message', `This is a metagame where only Pokemon with less than 280 BST are allowed!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/3734326/`);
		},
	},
};
