exports.BattleMovedex = {
	"knockoff": {
		inherit: true,
		onHit: function(target, source) {
			var item = target.getItem();
			if (item.id === 'mail') {
				this.debug('mail does not get knocked off in ktm');
				return;
			} else {
				item = target.takeItem(source);
			}
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] '+source);
			}
		}
	}
};