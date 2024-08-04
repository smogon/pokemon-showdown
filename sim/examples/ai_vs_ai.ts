import {BattleStream, getPlayerStreams} from '../battle-stream';
import {Teams} from '../teams';
import {RandomPlayerAI} from '../tools/random-player-ai';
import {PRNG, PRNGSeed} from '../prng';

class BiasedPlayerAI extends RandomPlayerAI {
    readonly bias: number;

    constructor(playerStream: PlayerStream, options: {seed?: PRNG | PRNGSeed | null, bias: number} = {bias: 0.8}) {
        super(playerStream, options);
        this.bias = options.bias;
    }

    protected chooseTeamPreview(): string {
        return this.prng.next() < this.bias ? 'team 1' : 'team 2';
    }

    protected chooseMove(): string {
        return this.prng.next() < this.bias ? 'move 1' : 'move 2';
    }
}

async function runBattle() {
    const streams = getPlayerStreams(new BattleStream());

    const spec = {formatid: 'gen8customgame'};
    const p1spec = {
        name: 'Player A',
        team: Teams.pack([
            {species: 'Pidgey', moves: ['tackle', 'gust']},
            {species: 'Rattata', moves: ['tackle', 'quickattack']}
        ]),
    };
    const p2spec = {
        name: 'Player B',
        team: Teams.pack([
            {species: 'Charmander', moves: ['scratch', 'ember']},
            {species: 'Squirtle', moves: ['tackle', 'watergun']}
        ]),
    };

    const p1 = new BiasedPlayerAI(streams.p1, {bias: 0.8});
    const p2 = new BiasedPlayerAI(streams.p2, {bias: 0.8});

    console.log('Player A is', p1.constructor.name);
    console.log('Player B is', p2.constructor.name);

    void p1.start();
    void p2.start();

    void (async () => {
        for await (const chunk of streams.omniscient) {
            console.log(chunk);
        }
    })();

    void streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);
}

runBattle().catch(err => console.error(err));