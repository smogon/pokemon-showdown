// tools/list-formats.js
const Sim = require("../dist/sim");
const Dex = Sim.Dex;

Dex.includeFormats?.(); // ensure formats loaded
for (const f of Dex.formats.all()) {
	if (f.mod === "fusion_gen" || (f.name && f.name.includes("Fusion"))) {
		console.log(f.id, "-", f.name, "-", f.mod);
	}
}
