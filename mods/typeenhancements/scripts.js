exports.BattleScripts = {
    init: function () {
        for (var i in this.data.Pokedex) {
            if (this.data.Pokedex[i].types === "Normal") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['hp'] = this.data.Pokedex[i].baseStats['hp'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Fighting") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 1.125;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Fairy") {
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.125;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Ice") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Psychic") {
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.25;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Fire") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.125;
                this.modData('Pokedex', i).baseStats['hp'] = this.data.Pokedex[i].baseStats['hp'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Grass") {
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 1.125;
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Water") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.25;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['hp'] * 0.875;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 0.875;
            } else if (this.data.Pokedex[i].types === "Electric") {
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 1.25;
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Steel") {
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 1.25;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Ghost") {
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.25;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 1.25;
                this.modData('Pokedex', i).baseStats['hp'] = this.data.Pokedex[i].baseStats['hp'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Dark") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.25;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Dragon") {
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 1.125;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Bug") {
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 1.125;
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.125;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 0.875;
                this.modData('Pokedex', i).basestats['hp'] = this.data.Pokedex[i].baseStats['hp'] * 0.875;
            } else if (this.data.Pokedex[i].types === "Rock") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 1.125;
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 0.875;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.875;
            } else if (this.data.Pokedex[i].types === "Ground") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 1.125;
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Poison") {
                this.modData('Pokedex', i).baseStats['atk'] = this.data.Pokedex[i].baseStats['atk'] * 1.125;
                this.modData('Pokedex', i).baseStats['spa'] = this.data.Pokedex[i].baseStats['spa'] * 1.125;
                this.modData('Pokedex', i).baseStats['spd'] = this.data.Pokedex[i].baseStats['spd'] * 0.75;
            } else if (this.data.Pokedex[i].types === "Flying") {
                this.modData('Pokedex', i).baseStats['spe'] = this.data.Pokedex[i].baseStats['spe'] * 1.25;
                this.modData('Pokedex', i).baseStats['def'] = this.data.Pokedex[i].baseStats['def'] * 0.75;
            }
        }
    }
}