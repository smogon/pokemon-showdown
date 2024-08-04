const assert = require('assert');
const {Battle} = require('.sim/battle');
const {BattleStream} = require('.sim/battle-stream');
const {Teams} = require('.sim/teams');

describe('Gen 8 Synthetic Battle', function () {
  it('should simulate a battle between two synthetic players', async function () {
    const battleStream = new BattleStream();

    const playerATeam = Teams.pack([
      {species: 'Pidgey', moves: ['tackle', 'gust']},
      {species: 'Rattata', moves: ['tackle', 'quickattack']}
    ]);

    const playerBTeam = Teams.pack([
      {species: 'Charmander', moves: ['scratch', 'ember']},
      {species: 'Squirtle', moves: ['tackle', 'watergun']}
    ]);

    const spec = {formatid: 'gen8customgame'};
    const playerASpec = {name: 'Player A', team: playerATeam};
    const playerBSpec = {name: 'Player B', team: playerBTeam};

    battleStream.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(playerASpec)}
>player p2 ${JSON.stringify(playerBSpec)}`);

    let battleEnded = false;
    let turnCount = 0;

    while (!battleEnded) {
      const chunk = await battleStream.read();
      if (chunk.startsWith('|win|')) {
        battleEnded = true;
        break;
      }

      if (chunk.includes('|turn|')) {
        turnCount++;
        const playerAChoice = Math.random() < 0.8 ? 'move 1' : 'move 2';
        const playerBChoice = Math.random() < 0.8 ? 'move 1' : 'move 2';

        if (turnCount === 1) {
          const playerATeamChoice = Math.random() < 0.8 ? 'team 1' : 'team 2';
          const playerBTeamChoice = Math.random() < 0.8 ? 'team 1' : 'team 2';
          battleStream.write(`>p1 ${playerATeamChoice}`);
          battleStream.write(`>p2 ${playerBTeamChoice}`);
        }

        battleStream.write(`>p1 ${playerAChoice}`);
        battleStream.write(`>p2 ${playerBChoice}`);
      }
    }

    assert(battleEnded, 'Battle should have ended');
    console.log(`Battle ended after ${turnCount} turns`);
  });
});