exports.BattleMovedex = {
    sketch: {
        inherit: true,
        onHit: function (target, source) {
            var disallowedMoves = {chatter:1, sketch:1, struggle:1};
            if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
            var moveslot = source.moves.indexOf('sketch');
            if (moveslot === -1) return false;
            var move = Tools.getMove(target.lastMove);
            var sketchedMove = {
                move: move.name,
                id: move.id,
                pp: move.pp,
                maxpp: move.pp,
                target: move.target,
                disabled: false,
                used: false
            };
            source.moveset[moveslot] = sketchedMove;
            source.baseMoveset[moveslot] = sketchedMove;
            source.moves[moveslot] = toId(move.name);
            if (moveslot < 2 && move.type !== 'Normal') {
                // Camomons-specific
                source.typesData[moveslot] = {
                    type: move.type,
                    suppressed: false,
                    isAdded: false
                };
            }
            this.add('-activate', source, 'move: Sketch', move.name);
        }
    },
    mimic: {
        inherit: true,
        onHit: function (target, source) {
            var disallowedMoves = {chatter:1, mimic:1, sketch:1, struggle:1, transform:1};
            if (source.transformed || !target.lastMove || disallowedMoves[target.lastMove] || source.moves.indexOf(target.lastMove) !== -1) return false;
            var moveslot = source.moves.indexOf('mimic');
            if (moveslot === -1) return false;
            var move = Tools.getMove(target.lastMove);
            source.moveset[moveslot] = {
                move: move.name,
                id: move.id,
                pp: move.pp,
                maxpp: move.pp,
                target: move.target,
                disabled: false,
                used: false
            };
            source.moves[moveslot] = toId(move.name);
            if (moveslot < 2 && move.type !== 'Normal') {
                // Camomons-specific
                source.typesData[moveslot] = {
                    type: move.type,
                    suppressed: false,
                    isAdded: false
                };
            }
            this.add('-start', source, 'Mimic', move.name);
        }
    }
};