import {BattleStream, getPlayerStreams} from '../battle-stream';
import {Battle} from '../battle';
import {Teams} from '../teams';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function promptForSwitch(battleStream: BattleStream, playerNumber: string) {
    if (!battleStream.battle) {
        console.log('Battle not initialized yet');
        return;
    }
    const side = battleStream.battle.sides[parseInt(playerNumber) - 1];
    if (side.pokemon.some(p => !p.fainted)) {
        while (true) {
            console.log(`? Player ${playerNumber}, your active Pokémon fainted. Choose a Pokémon to switch in:`);
            console.log('Party:');
            side.pokemon.forEach((pokemon, index) => {
                const status = pokemon.fainted ? ' (fainted)' : '';
                console.log(`  ${index + 1}. ${pokemon.name}${status}`);
            });
            console.log(`Enter your choice (e.g., "switch 2"):`);
            const playerInput = await promptInput('');
            const [action, target] = playerInput.split(' ');
            
            if (action !== 'switch' || !/^[1-6]$/.test(target)) {
                console.log('Invalid input. Use "switch X" where X is 1-6.');
                continue;
            }
            
            const switchIndex = parseInt(target) - 1;
            if (switchIndex >= side.pokemon.length || side.pokemon[switchIndex].fainted) {
                console.log('Invalid or fainted Pokémon. Choose again.');
                continue;
            }
            
            const formattedInput = `>p${playerNumber} ${playerInput}`;
            console.log(`Sending: ${formattedInput}`);
            void battleStream.write(formattedInput);
            break;
        }
    } else {
        console.log(`Player ${playerNumber} has no more Pokémon left!`);
    }
}

async function promptForAction(battleStream: BattleStream, playerNumber: number) {
    if (!battleStream.battle) {
        console.log('Battle not initialized yet');
        return;
    }
    const side = battleStream.battle.sides[playerNumber - 1];
    const activePokemon = side.active[0];
    if (!activePokemon || activePokemon.fainted) return;

    const request = activePokemon.getMoveRequestData();

    while (true) {
        console.log(`? Player ${playerNumber}, choose your action:`);
        
        if (request.moves && request.moves.length > 0) {
            console.log('Moves:');
            request.moves.forEach((move, index) => {
                console.log(`  ${index + 1}. ${move.move}${move.disabled ? ' (disabled)' : ''}`);
            });
        }

        console.log('Party:');
        side.pokemon.forEach((pokemon, index) => {
            console.log(`  ${index + 1}. ${pokemon.name}${pokemon.fainted ? ' (fainted)' : ''}`);
        });

        console.log(`Enter your choice (e.g., "move 1" or "switch 2"):`);
        const playerInput = await promptInput('');
        const [action, target] = playerInput.split(' ');
        
        if ((action !== 'move' && action !== 'switch') || !/^[1-6]$/.test(target)) {
            console.log('Invalid input. Use "move X" or "switch X" where X is 1-6.');
            continue;
        }
        
        const index = parseInt(target) - 1;
        if (action === 'move' && (index >= request.moves.length || request.moves[index].disabled)) {
            console.log('Invalid or disabled move. Choose again.');
            continue;
        }
        
        if (action === 'switch' && (index >= side.pokemon.length || side.pokemon[index].fainted)) {
            console.log('Invalid or fainted Pokémon. Choose again.');
            continue;
        }
        
        const formattedInput = `>p${playerNumber} ${playerInput}`;
        console.log(`Sending: ${formattedInput}`);
        void battleStream.write(formattedInput);
        break;
    }
}

async function handleTurn(battleStream: BattleStream) {
    for (let i = 1; i <= 2; i++) {
        await promptForAction(battleStream, i);
    }
}

async function handleTeamPreview(streams: ReturnType<typeof getPlayerStreams>) {
    console.log('? Player 1, choose your lead Pokémon (e.g., ">p1 team 1"): ');
    const p1Input = await promptInput('');
    void streams.omniscient.write(p1Input);
    console.log('? Player 2, choose your lead Pokémon (e.g., ">p2 team 1"): ');
    const p2Input = await promptInput('');
    void streams.omniscient.write(p2Input);
}

function prettyPrintTeamState(battle: Battle) {
    const output: string[] = [];

    for (const side of battle.sides) {
        output.push(`${side.name}'s team:`);
        for (const pokemon of side.pokemon) {
            const isActive = pokemon === side.active[0];
            const status = pokemon.status ? pokemon.status : 'healthy';
            const item = pokemon.item ? pokemon.item : 'no item';
            const hpStatus = pokemon.fainted ? 'fainted' : `${pokemon.hp}/${pokemon.maxhp} HP`;
            const activeMarker = isActive ? '>' : ' ';

            output.push(`${activeMarker} ${pokemon.name} (${item}) - ${hpStatus} - ${status}`);
        }
        output.push('');
    }

    console.log(output.join('\n'));
}

async function runBattle() {
    const battleStream = new BattleStream();
    const streams = getPlayerStreams(battleStream);

    const spec = {formatid: 'gen8customgame'};
    const p1spec = {
        name: 'Player 1',
        team: Teams.pack([
            {species: 'Pidgey', moves: ['tackle', 'gust']},
            {species: 'Rattata', moves: ['tackle', 'quickattack']}
        ]),
    };
    const p2spec = {
        name: 'Player 2',
        team: Teams.pack([
            {species: 'Charmander', moves: ['scratch', 'ember']},
            {species: 'Squirtle', moves: ['tackle', 'watergun']}
        ]),
    };

    console.log('Battle starting: Player 1 vs Player 2');

    void streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

    for await (const chunk of streams.omniscient) {
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.includes('|teampreview')) {
                await handleTeamPreview(streams);
            } else if (line.startsWith('|faint|')) {
                const faintedPokemon = line.split('|')[2];
                const playerNumber = faintedPokemon.charAt(1);
                await promptForSwitch(battleStream, playerNumber);
            }
        }

        if (chunk.includes('|turn|')) {
            prettyPrintTeamState(battleStream.battle!);
            await handleTurn(battleStream);
        }

        if (chunk.startsWith('|win|')) {
            console.log('Battle ended!');
            break;
        }
    }

rl.close();
}

runBattle().catch(err => console.error(err));