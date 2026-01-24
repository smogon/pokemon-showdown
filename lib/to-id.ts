/**
 * toID
 *
 * Converts anything to an ID. An ID must have only lowercase alphanumeric
 * characters.
 *
 * If a string is passed, it will be converted to lowercase and
 * non-alphanumeric characters will be stripped.
 *
 * If an object with an ID is passed, its ID will be returned.
 * Otherwise, an empty string will be returned.
 *
 * Generally assigned to the global toID, because of how
 * commonly it's used.
 *
 */

export function toID(text: any): ID {
	if (typeof text !== 'string') {
		if (text) text = text.id || text.userid || text.roomid || text;
		if (typeof text === 'number') text = `${text}`;
		else if (typeof text !== 'string') return '';
	}
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}
