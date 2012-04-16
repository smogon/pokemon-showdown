var currentIndentLevel = 0;
exports.writeLine = function(line, indent) {
	if (!indent || typeof indent !== "number")
		indent = 0;

	var nextIndentLevel = currentIndentLevel + indent;
	if (nextIndentLevel < 0)
		nextIndentLevel = 0;

	if (indent < 0)
		for (var indentLevel = nextIndentLevel; indentLevel > 0; --indentLevel)
			process.stdout.write("\t");
	else
		for (; currentIndentLevel > 0; --currentIndentLevel)
			process.stdout.write("\t");

	process.stdout.write(line);
	process.stdout.write("\n");
	currentIndentLevel = nextIndentLevel;
}

exports.ObjectIsLastKey = function(object, key) {
	return Object.keys(object).indexOf(key) === Object.keys(object).length - 1;
}

exports.toId = function(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

exports.toIdForForme = function(combinedName, forme) {
	switch (combinedName) {
		case "Unown-!" :
			return "em";

		case "Unown-?" :
			return "qm";

		case "Arceus-???" :
			return "unknown";

		case "Basculin-Blue-Striped" :
			return "blue";
	}
	return toId(forme);
}

exports.toIdForName = function(combinedName, forme) {
	var result = toId(combinedName.replace("♂", "M").replace("♀", "F"));
	var formeId = toIdForForme(combinedName, forme);
	if (result.indexOf(formeId) === -1)
		if (toId(forme).length === 0)
			result += formeId;
		else
			if(result.indexOf(toId(forme)) !== -1)
				result.replace(toId(forme), formeId);
	return result;
}
