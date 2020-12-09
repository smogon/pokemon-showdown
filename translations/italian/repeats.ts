import type {Translations} from '../../server/chat';

export const translations: Translations = {
	strings: {
		"Repeated phrases in ${room.title}": "Frasi ripetute in ${room.title}",
		"There are no repeated phrases in ${room.title}.": "Non ci sono frasi ripetute in ${room.title}.",
		"Action": "Azione",
		"Phrase": "Frase",
		"Identifier": "Identificatore",
		"Interval": "Intervallo",
		"every ${minutes} minute(s)": "ogni ${minutes} minuto(i)",
		"Raw text": "Testo",
		"Remove": "Rimuovi",
		"Remove all repeats": "Rimuovi tutti i repeat",
		"You must specify an interval as a number of minutes between 1 and 1440.": "Devi specificare un intervallo di minuti compreso tra 1 e 1440.",
		'The phrase labeled with "${id}" is already being repeated in this room.': 'La frase identificata con "${id}" viene già ripetuta in questa room.',
		'${user.name} set the phrase labeled with "${id}" to be repeated every ${interval} minute(s).': '${user.name} ha impostato la frase identificata con "${id}" da ripetere ogni ${interval} minuto(i).',
		'${user.name} set the Room FAQ "${topic}" to be repeated every ${interval} minute(s).': '${user.name} ha impostato il Room FAQ "${topic}" da ripetere ogni ${interval} minuto(i).',
		'The phrase labeled with "${id}" is not being repeated in this room.': 'La frase identificata con "${id}" non viene ripetuta in questa room.',
		'The text for the Room FAQ "${topic}" is already being repeated.': 'Il testo del Room FAQ "${topic}" viene già ripetuto.',
		'${user.name} removed the repeated phrase labeled with "${id}".': '${user.name} ha rimosso la frase ripetuta identificata con "${id}".',
		"There are no repeated phrases in this room.": "Non ci sono frasi ripetute in questa room.",
		"${user.name} removed all repeated phrases.": "${user.name} ha rimosso tutte le frasi ripetute.",
		"You must specify a room when using this command in PMs.": "Devi specificare una room quando usi questo comando in PM.",
	},
};
