export class UrpgBattleRules {
	generation: string = "";
    battleType: string = "";
    numTeams: number = 2;
    numTrainersPerTeam: number = 2;
    numPokemonPerTrainer: number = 6;
    sendType: string = "";
    teamType: string = "";
    startingWeather: string = "none";
    startingTerrain: string = "none";
    ohkoClause: boolean = true;
    accClause: boolean = true;
    evaClause: boolean = true;
    sleepClause: boolean = true;
    freezeClause: boolean = true;
    speciesClause: boolean = true;
    itemsAllowed: boolean = false;
    itemClause: boolean = true;
    megasAllowed: boolean = true;
    zmovesAllowed: boolean = true;
    dynamaxAllowed: boolean = true;
    teraAllowed: boolean = true;
    worldCoronationClause: boolean = true;
    legendsAllowed: boolean = true;
    randomClause: boolean = false;
    inversionClause: boolean = false;
    skyClause: boolean = false;
    gameboyClause: boolean = false;
    wonderLauncherClause: boolean = false;
    rentalClause: boolean = true;

	constructor() {}
}