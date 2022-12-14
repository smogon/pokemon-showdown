# go through every value in /formats-data.ts/
# inside that value check if "isNonstandard" is set to "Past" and tier is set to "Illegal"
# if so, remove isNonstandard and set tier to its natDexTier
# if not, do nothing
# save the file
import json
import os

data = json.load(open("t.json"))

for key in data:
	if "isNonstandard" not in data[key] or "tier" not in data[key]:
		continue
	if data[key]["isNonstandard"] == "Past" and data[key]["tier"] == "Illegal":
		del data[key]["isNonstandard"]
		if "natDexTier" in data[key]:
			data[key]["tier"] = data[key]["natDexTier"]
		else:
			data[key]["tier"] = "UU"

with open("formats-data.ts", "w") as f:
	f.write("export const FormatsData: {[k: string]: SpeciesFormatsData} = {")
	for key in data:
		f.write("\n\t" + key + ": " + json.dumps(data[key]) + ",")
	f.write("\n};")
                