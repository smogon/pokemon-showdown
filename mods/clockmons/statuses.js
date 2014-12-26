exports.BattleStatuses = {
    raindance: {
        inherit: true,
        duration: 10,
        durationCallback: function (source, effect) {
            if (source && source.item === 'damprock') {
                return 13;
            }
            return 10;
        }
    },
    sunnyday: {
        inherit: true,
        duration: 10,
        durationCallback: function (source, effect) {
            if (source && source.item === 'heatrock') {
                return 13;
            }
            return 10;
        }
    },
    sandstorm: {
        inherit: true,
        duration: 10,
        durationCallback: function (source, effect) {
            if (source && source.item === 'smoothrock') {
                return 13;
            }
            return 10;
        }
    },
    hail: {
        inherit: true,
        duration: 10,
        durationCallback: function (source, effect) {
            if (source && source.item === 'icyrock') {
                return 13;
            }
            return 10;
        }
    }
};