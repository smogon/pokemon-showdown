const { Battle } = require('../dist/sim/battle');
const { Teams } = require('../dist/sim/teams');
const { BattleStream, getPlayerStreams } = require('../dist/sim/battle-stream')
const { State } = require('../dist/sim/state')

// const state = new State();  // singleton for serialization / deserialization
const pasteToTeam = (paste) => Teams.import(paste)
const teamToSpec = (name, team) => {
    return {
        name: name,
        team: Teams.pack(team),
    }
}

const pastesToBattleState = (human_paste, ai_paste) => {
    if (!human_paste || !ai_paste) {
        throw new Error(`Invalid input: human_paste: ${human_paste}, ai_paste: ${ai_paste}`);
    }
    const battle = new Battle({
        formatid: 'gen8customgame',
        seed: [Math.random() * 0x10000, Math.random() * 0x10000, Math.random() * 0x10000, Math.random() * 0x10000],
    });
    battle.setPlayer('p1', teamToSpec("Human Player", pasteToTeam(human_paste)));
    battle.setPlayer('p2', teamToSpec("AI Player", pasteToTeam(ai_paste)));
    battle.makeChoices('default', 'default');
    return State.serializeBattle(battle);
}

const getPossibleActions = (battle_state) => {
    const battle = State.deserializeBattle(battle_state);
    const possibleActions = { p1: [], p2: [] };

    for (const side of battle.sides) {
        const playerKey = side.id;
        const activePokemon = side.active[0];

        if (activePokemon && !activePokemon.fainted) {
            const request = activePokemon.getMoveRequestData();

            // Add move actions
            if (request.moves) {
                request.moves.forEach((move, index) => {
                    if (!move.disabled) {
                        possibleActions[playerKey].push({
                            choice: 'move',
                            move: battle.dex.getActiveMove(move.id),
                            pokemon: activePokemon,
                            targetLoc: 0, // Assuming single battles for simplicity
                            mega: !!request.canMegaEvo,
                            zmove: request.canZMove ? move.id : undefined,
                            maxMove: request.canDynamax ? move.id : undefined,
                        });
                    }
                });
            }

            // Add switch actions
            side.pokemon.forEach((pokemon, index) => {
                if (index !== 0 && !pokemon.fainted) {
                    possibleActions[playerKey].push({
                        choice: 'switch',
                        pokemon: activePokemon,
                        target: pokemon,
                    });
                }
            });
        }
    }

    // possibleActions is a really big json
    // the client doesn't need to see the whole thing
    // just the names of the move if it's a move
    // and the name of the target if it's a switch

    const simplifyChoiceRepresentation = (action) => {
        if (action.choice === 'move') {
            return {
                "choice": action.choice,
                "move": action.move.name,
                "targetLoc": action.targetLoc,
                "mega": action.mega
            };
        } else if (action.choice === 'switch') {
            return {"choice": action.choice, "target": action.target.name};
        }
    }

    possibleActions.p1 = possibleActions.p1.map(simplifyChoiceRepresentation);
    possibleActions.p2 = possibleActions.p2.map(simplifyChoiceRepresentation);
    return possibleActions;
};

const updateBattleStateWithActions = (battle_state, p1Action, p2Action) => {
    const battle = State.deserializeBattle(battle_state);
    battle.send = () => {}; // Mock send method

    const actions = [p1Action, p2Action];

    for (const action of actions) {
        if (!action || typeof action !== 'object') {
            console.error('Invalid action:', action);
            continue;
        }

        if (action.choice === 'move') {
            // Check only for required properties
            if (!action.move) {
                console.error('Invalid move action:', action);
                continue;
            }
            battle.choose('p1', `move ${action.move}${action.mega ? ' mega' : ''}`);
        } else if (action.choice === 'switch') {
            // Check only for required properties
            if (!action.target) {
                console.error('Invalid switch action:', action);
                continue;
            }
            battle.choose('p1', `switch ${action.target}`);
        } else {
            console.error('Unknown action choice:', action.choice);
        }
    }

    battle.makeChoices();

    return State.serializeBattle(battle);
};

function summarizePokemon(pokemon) {
    if (!pokemon.species) {
        console.log("tf", pokemon)
        // throw new Error('test')
    } else {
        console.log("success", pokemon.species)
    }
    
    if (!pokemon) return null;
    return {
        name: pokemon.species,
        currentHp: pokemon.hp,
        totalHp: pokemon.maxhp,
        status: pokemon.status || 'healthy'
    };
}

function summarizeFieldConditions(field) {
    const conditions = [];
    if (field.weather) conditions.push(field.weather);
    if (field.terrain) conditions.push(field.terrain);
    
    // Add other field conditions
    const otherConditions = ['trickroom', 'wonderroom', 'magicroom', 'gravity'];
    otherConditions.forEach(condition => {
        if (field[condition]) conditions.push(condition);
    });

    return conditions.length > 0 ? conditions : ['empty terrain'];
}

function summarizeSideConditions(sideConditions) {
    return Object.entries(sideConditions)
        .filter(([_, value]) => value)
        .map(([condition, _]) => condition);
}

function summarizeBattleState(battle_state) {
    const battle = State.deserializeBattle(battle_state);
    const summary = {
        players: {},
        fieldConditions: summarizeFieldConditions(battle.field)
    };
    ['p1', 'p2'].forEach((player, index) => {
        summary.players[player] = {
            team: battle_state.sides[index].pokemon.map(summarizePokemon),
            sideConditions: summarizeSideConditions(battle_state.sides[index].sideConditions)
        };
    });
    return summary;
}

module.exports = {
    pastesToBattleState,
    getPossibleActions,
    updateBattleStateWithActions,
    summarizeBattleState
};