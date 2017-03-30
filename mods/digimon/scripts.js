
		//Generate the team randomly.
		let pool = Object.keys(sets);
		for (let i = 0; i < 4; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
			let sigItems = ['Small Recovery', 'Medium Recovery', 'Large Recovery', 'Super Recovery Floppy', 'MP Floppy', 'Medium MP Floppy', 'Large MP Floppy', 'Various', 'Protection', 'Omnipotent', 'Double Floppy', 'Restore Floppy', 'Super Restore Floppy', 'Offense Disk', 'Defense Disk', 'Hi Speed Disk', 'Super Defense Disk', 'Super Offense Disk', 'Super Speed Disk', 'Omnipotent Disk'];
			let choosenItems = [];
			for (let h = 0; h < 3; h++) {
				let itemChoosen = sigItems[Math.floor(Math.random() * sigItems.length)];
				let rejected = false;
				if (choosenItems.length !== 0) {
					for (let k = 0; k < choosenItems.length; k++) {
						if (choosenItems[k] === itemChoosen) rejected = true;
					}
				}
				if (!rejected) {
					choosenItems.push(itemChoosen);
				} else {
					h--;
				}
				if (h === 2 && choosenItems.length !== 3) h--;
			}
			set.moves = [this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves), 'Protect', set.signatureMove].concat(choosenItems);
			team.push(set);
		}
		return team;
	},
};
