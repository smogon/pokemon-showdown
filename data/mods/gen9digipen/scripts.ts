import { initCustomMod } from '../../custom-mod-init';

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen9modbase',
	// `init` is the one part of scripts.ts that is not inherited, so every custom content mod has
	// to call this itself. See data/custom-mod-init.ts.
	init() {
		initCustomMod(this);
	},
};
