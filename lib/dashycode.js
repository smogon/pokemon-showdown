/**
 * Dashycode!
 *
 * Encodes a string in a restricted string containing only alphanumeric
 * characters and dashes.
 *
 * (The name is a riff on Punycode, which is what I originally wanted
 * to use for this purpose, but it turns out Punycode does not work on
 * arbitrary strings.)
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

'use strict';

const CODE_MAP = "23456789abcdefghijkmnpqrstuvwxyz";
const UNSAFE_MAP = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

// chunk types:
// 0b00 = 0x0 = block separator ("wait until next dash")
// 0b01 = 0x1 = capitalize
//   0b1_01 = 0x5 = specify capitalization of next 8 alphabetic chars of safe part (8 more bits)
//   0b0_01 = 0x1 = short for 0b00000001_1_01 (capitalize first letter of next 8 alpha chars of safe part)
// 0b10 = 0x2 = ASCII in UNSAFE_MAP (5 more bits)
// 0b11 = 0x3 = other
//   0b0_11 = 0x3 = space
//   0b1_11 = 0x7 = UTF-16 (16 more bits)

/**
 * An object representing a Dashycode bitstream.
 * The stream can be either a read stream or a write stream, but not
 * both simultaneously.
 *
 * @typedef {Object} DashyStream
 * @property {string} codeBuf
 * @property {number} buf
 * @property {number} bufLength
 */

/**
 * @param {DashyStream} stream
 * @param {number} writeBufLength in bits
 * @param {number} writeBuf
 */
function streamWrite(stream, writeBufLength, writeBuf) {
	stream.buf += (writeBuf << stream.bufLength);
	stream.bufLength += writeBufLength;
	while (stream.bufLength >= 5) {
		stream.codeBuf += CODE_MAP.charAt(stream.buf & 0x1F);
		stream.buf >>= 5;
		stream.bufLength -= 5;
	}
}
/**
 * @param {DashyStream} stream
 */
function streamGetCode(stream) {
	const buf = stream.codeBuf + CODE_MAP.charAt(stream.buf);

	// truncate trailing `2`s (0b00000 chunks)
	let end2Len = 0;
	while (buf.charAt(buf.length - 1 - end2Len) === '2') end2Len++;
	return end2Len ? buf.slice(0, -end2Len) : buf;
}

/**
 * @param {DashyStream} stream
 * @param {number} readLength
 * @param {number} readMask passed for "perf"
 */
function streamPeek(stream, readLength, readMask = 0xFFFF >> (16 - readLength)) {
	while (stream.bufLength < readLength && stream.codeBuf.length) {
		const next5Bits = CODE_MAP.indexOf(stream.codeBuf.charAt(0));
		if (next5Bits < 0) throw new Error("Invalid character in coded buffer");
		stream.codeBuf = stream.codeBuf.slice(1);
		stream.buf += next5Bits << stream.bufLength;
		stream.bufLength += 5;
	}
	return stream.buf & readMask;
}
/**
 * @param {DashyStream} stream
 * @param {number} readLength
 * @param {number} readMask passed for "perf"
 */
function streamRead(stream, readLength, readMask = 0xFFFF >> (16 - readLength)) {
	const output = streamPeek(stream, readLength, readMask);
	// Note: bufLength can go negative! Streams have infinite trailing 0s
	stream.buf >>= readLength;
	stream.bufLength -= readLength;
	return output;
}

/**
 * @param {string} str
 */
function encode(str, allowCaps = false) {
	if (!str) return '0--0';
	let safePart = '';
	let unsafeStream = /** @type {DashyStream} */ ({
		codeBuf: '',
		buf: 0x0,
		bufLength: 0,
	});
	let isSafe = true;
	let alphaIndex = 0;
	let capBuffer = 0x0;
	for (let i = 0; i < str.length + 1; i++) {
		let curCharCode = str.charCodeAt(i);
		const isLowercase = (97 <= curCharCode && curCharCode <= 122); // a-z
		const isUppercase = (65 <= curCharCode && curCharCode <= 90); // A-Z
		const isNumeric = (48 <= curCharCode && curCharCode <= 57); // 0-9
		if (capBuffer && (
			!(isLowercase || isUppercase || isNumeric) ||
			alphaIndex >= 8 ||
			i === str.length
		)) {
			// flush cap buffer
			if (capBuffer === 0xD) {
				streamWrite(unsafeStream, 3, 0x1);
			} else {
				streamWrite(unsafeStream, 11, capBuffer);
			}
			alphaIndex -= 8;
			capBuffer = 0x0;
		}
		if (i === str.length) break;
		if (isLowercase || isUppercase || isNumeric) {
			if (alphaIndex < 0) throw new Error("alphaIndex should be non-negative here");
			if (!isSafe) {
				if (capBuffer) throw new Error("capBuffer shouldn't exist here");
				streamWrite(unsafeStream, 2, 0x0);
				isSafe = true;
			}
			if (isUppercase && !allowCaps) {
				safePart += String.fromCharCode(curCharCode + 32);
				while (alphaIndex >= 8) {
					if (capBuffer) throw new Error("capBuffer shouldn't exist here");
					alphaIndex -= 8;
					streamWrite(unsafeStream, 11, 0x5);
				}
				if (!capBuffer) capBuffer = 0x5;
				capBuffer += 1 << (alphaIndex + 3);
			} else {
				safePart += str.charAt(i);
			}
			if (isUppercase || isLowercase) alphaIndex++;
			continue;
		}
		if (capBuffer) throw new Error("capBuffer shouldn't exist here");
		alphaIndex = 0;
		if (isSafe && curCharCode === 32) { // space
			const nextCharCode = str.charCodeAt(i + 1);
			if ((97 <= nextCharCode && nextCharCode <= 122) || // a-z
				(65 <= nextCharCode && nextCharCode <= 90) || // A-Z
				(48 <= nextCharCode && nextCharCode <= 57)) { // 0-9
				safePart += '-';
				streamWrite(unsafeStream, 2, 0x0);
				continue;
			}
		}
		if (isSafe) {
			safePart += '-';
			isSafe = false;
		}
		let unsafeMapIndex = -1;
		if (curCharCode === 0) {
			streamWrite(unsafeStream, 2, 0x0);
		} else if (curCharCode === 32) { // space
			streamWrite(unsafeStream, 3, 0x3);
		} else if ((unsafeMapIndex = UNSAFE_MAP.indexOf(str.charAt(i))) >= 0) {
			curCharCode = (unsafeMapIndex << 2) + 0x2;
			streamWrite(unsafeStream, 7, curCharCode);
		} else {
			curCharCode = (curCharCode << 2) + 0x7;
			streamWrite(unsafeStream, 19, curCharCode);
		}
	}
	let unsafePart = streamGetCode(unsafeStream);
	if (safePart.charAt(0) === '-') {
		safePart = safePart.slice(1);
		unsafePart = unsafePart + '2';
	}
	if (safePart.slice(-1) === '-') {
		safePart = safePart.slice(0, -1);
	}
	if (!safePart) {
		safePart = '0';
		unsafePart = '0' + unsafePart;
		if (unsafePart.slice(-1) === '2') unsafePart = unsafePart.slice(0, -1);
	}
	if (!unsafePart) return safePart;
	return safePart + '--' + unsafePart;
}

/**
 * @param {string} codedStr
 */
function decode(codedStr) {
	let str = '';
	let lastDashIndex = codedStr.lastIndexOf('--');
	if (lastDashIndex < 0) {
		// the regular decoder can also handle this case; but this should
		// be faster
		return codedStr.replace(/-/g, ' ');
	}
	if (codedStr.charAt(lastDashIndex + 2) === '0') {
		if (codedStr.charAt(0) !== '0' || lastDashIndex !== 1) {
			throw new Error("Invalid Dashycode");
		}
		lastDashIndex -= 1;
		codedStr = '--' + codedStr.slice(4);
	}
	if (codedStr.slice(-1) === '2') {
		codedStr = '-' + codedStr.slice(0, -1);
		lastDashIndex += 1;
	}
	let unsafeStream = /** @type {DashyStream} */ ({
		codeBuf: codedStr.slice(lastDashIndex + 2),
		buf: 0x0,
		bufLength: 0,
	});
	/**
	 * Status:
	 * 1 : awaiting next read
	 * 0 : assume all-lowercase
	 * other: 1 followed by n bits, describing the capitalization of the
	 * next n bits of alphabetic characters
	 */
	let capBuffer = 1;
	for (let i = 0; i < lastDashIndex + 1; i++) {
		let curChar = codedStr.charAt(i);
		if (curChar !== '-') {
			// safe char
			const curCharCode = codedStr.charCodeAt(i);
			const isLowercase = (97 <= curCharCode && curCharCode <= 122); // a-z
			if (isLowercase) {
				if (capBuffer === 1) {
					capBuffer = 0;
					if (streamPeek(unsafeStream, 2, 0x3) === 0x1) {
						switch (streamRead(unsafeStream, 3, 0x7)) {
						case 0x5:
							capBuffer = streamRead(unsafeStream, 8, 0xFF) + 0x100;
							break;
						case 0x1:
							capBuffer = 0x101;
							break;
						}
					}
				}
				const toCapitalize = capBuffer & 0x1;
				capBuffer >>= 1;
				if (toCapitalize) {
					curChar = String.fromCharCode(curCharCode - 32);
				}
			}
			str += curChar;
		} else {
			capBuffer = 1;
			// pull out the next unsafe string
			let isEmpty = true;
			do {
				switch (streamRead(unsafeStream, 2, 0x3)) {
				case 0x0:
					// go back to parsing safe chars
					curChar = '';
					break;
				case 0x1:
					throw new Error("Invalid capitalization token");
				case 0x2:
					curChar = UNSAFE_MAP.charAt(streamRead(unsafeStream, 5, 0x1F));
					isEmpty = false;
					break;
				case 0x3:
					if (streamRead(unsafeStream, 1, 0x1)) {
						curChar = String.fromCharCode(streamRead(unsafeStream, 16, 0xFFFF));
					} else {
						curChar = ' ';
					}
					isEmpty = false;
					break;
				}
				str += curChar;
			} while (curChar);
			if (isEmpty && i !== lastDashIndex) str += ' ';
		}
	}
	return str;
}

/**
 * @param {string} codeBuf
 */
function vizStream(codeBuf, translate = true) {
	let spacedStream = '';
	if (codeBuf.charAt(0) === '0') {
		codeBuf = codeBuf.slice(1);
		spacedStream = ' [no safe chars]' + spacedStream;
	}
	if (codeBuf.slice(-1) === '2') {
		codeBuf = codeBuf.slice(0, -1);
		spacedStream = ' [start unsafe]' + spacedStream;
	}
	let stream = /** @type {DashyStream} */ ({
		codeBuf,
		buf: 0x0,
		bufLength: 0,
	});
	function vizBlock(/** @type {DashyStream} */ stream, /** @type {number} */ bufLen) {
		const buf = streamRead(stream, bufLen);
		// @ts-ignore
		return buf.toString(2).padStart(bufLen, '0');
	}
	while (stream.bufLength > 0 || stream.codeBuf) {
		switch (streamRead(stream, 2)) {
		case 0x0:
			spacedStream = (translate ? ' |' : ' 00') + spacedStream;
			break;
		case 0x1:
			if (streamRead(stream, 1)) {
				spacedStream = ' ' + vizBlock(stream, 8) + (translate ? '-cap' : '_1_01') + spacedStream;
			} else {
				spacedStream = (translate ? ' capfirst' : ' 0_01') + spacedStream;
			}
			break;
		case 0x2:
			spacedStream = ' ' + vizBlock(stream, 5) + (translate ? '-ascii' : '_10') + spacedStream;
			break;
		case 0x3:
			if (streamRead(stream, 1)) {
				spacedStream = ' ' + vizBlock(stream, 16) + (translate ? '-utf' : '_1_11') + spacedStream;
			} else {
				spacedStream = (translate ? ' space' : ' 0_11') + spacedStream;
			}
			break;
		}
	}
	return spacedStream;
}

module.exports = {
	encode,
	decode,
	vizStream,
};
