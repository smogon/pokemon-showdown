import {PRNG, PRNGSeed} from "../../../sim/prng";
import RandomTeams from "../../random-teams";

export class RandomGen8Teams extends RandomTeams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}
}

export default RandomGen8Teams;
