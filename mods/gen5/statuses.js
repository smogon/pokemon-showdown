exports.BattleStatuses = {
	slp: {
		inherit: true,
		onSwitchIn: function(target) {
			this.effectData.time = this.effectData.startTime;
		}
	}
};
