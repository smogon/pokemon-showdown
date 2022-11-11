export const Abilities: {[k: string]: ModdedAbilityData} = {
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
	},
};
