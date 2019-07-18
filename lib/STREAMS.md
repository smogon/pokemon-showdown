Streams
=======

Streams are variables used to interact with large amounts of data without needing to keep it all loaded in RAM.

A stream is used where you would normally use a string, Buffer, or Array, but only part of it is kept in memory at once.

Node.js comes with built-in support for streams, and there is also a WHATWG Streams spec (which are incompatible, of course). Both APIs are hard to use and have unnecessary amounts of boilerplate; the Node version more so. This API can wrap Node's API, or it can be used independently, and is a lot easier to use.

An overview:

- `WriteStream` is a string/Buffer write stream. Write to it with `writeStream.write(data)`.
- `ReadStream` is a string/Buffer read stream. Read inputs by line with `readStream.readLine()` or by chunk with `readStream.read()`, or pipe inputs to a `WriteStream` with `readStream.pipe(writeStream)`.
- `ReadWriteStream` is a string/Buffer read/write stream.

These streams are not API-compatible with Node streams, but can wrap them.

### "override encoding"

Buffer stream methods often take an "override encoding" parameter. Normally, you should never use it: streams will automatically convert between strings and Buffers using their built-in encoding, which defaults to `utf8`, and can be changed by setting `stream.encoding`.

However, if for some reason you need to change which encoding you use on a per-read or per-write basis, you can pass the relevant encoding to the individual methods.


## Interface: WriteStream

A `WriteStream` can be written to.

### writeStream.write(chunk, [encoding])

* `chunk` {string|Buffer|null} data to write
* `encoding` [override encoding][]
* Returns: {Promise<void>} for the next time it's safe to write to the `writeStream`.

Writes to the stream. `writeStream.write(null)` is equivalent to `writeStream.end()`.

### writeStream.writeLine(chunk, [encoding])

* `chunk` {string} data
* `encoding` [override encoding][]
* Returns: {Promise<void>} for the next time it's safe to write to the `writeStream`.

Writes a line to the stream. Equivalent to `writeStream.write(chunk + '\n')`.

### writeStream.end()

* Returns: {Promise<void>} for when the stream finishes.

Ends the write stream.

This tells the write stream that you're done writing to it. In the Buffer/string analogy, it means you've reached the end of the Buffer/string. Certain write streams require this.


## Interface: ReadStream

A `ReadStream` can be read from.

### readStream.read([encoding])

* `encoding` [override encoding][]
* Returns: {Promise<string | null>} the data read.

Reads data from the read stream as fast as possible.

Specifically, this waits for the internal buffer to become non-empty, and then reads the entire contents of the internal buffer.

The Promise resolves to `null` if there is no more data to be read (you have already read to the end).

There's rarely a need to use this function directly; you either know how many bytes you're looking for (and should be using `read(byteCount)`), or you're looking for a delimiter (and should be using `readLine()` or `readDelimitedBy(delimiter)`), or you just want the entire stream contents (and should be using `readAll()`).

### readStream.read(byteCount, [encoding])

* `byteCount` number of bytes to read
* `encoding` [override encoding][]
* Returns: {Promise<string | null>} the data read.

Reads `byteCount` bytes from the read stream.

As `readStream.read([encoding])` above, but waits for at least `byteCount` bytes to become available, and then reads and returns exactly `byteCount` bytes. Only if you are at the end of the read stream will fewer than `byteCount` bytes be returned.

This does mean that if the stream has new data, but less than `byteCount` bytes of data, the Promise will not resolve unless the stream has ended.

You may also set `byteCount` to `null` to make this behave like `readStream.read([encoding])` above.

### readStream.readLine([encoding])

* `encoding` [override encoding][]
* Returns: {Promise<string | null>} the data read.

Reads a line (a string delimited by `\n` or `\r\n`) from the stream.

The equivalent of `readDelimitedBy('\n')`, but chopping off any trailing `\r` from the result.

### readStream.readDelimitedBy(delimiter, [encoding])

* `encoding` [override encoding][]
* Returns: {Promise<string | null>} the data read.

Reads a line delimited by `delimiter` from the stream.

Specifically: waits for either `delimiter` to appear in the stream, or for the stream to end.

If the stream has reached the end with no (more) appearances of `delimiter`, read everything.

Otherwise, read up to the delimiter, then discard the delimiter.

`readDelimitedBy` does not distinguish between a delimiter and a terminator. If the stream ends in `delimiter`, it will be treated as a terminator, otherwise it will be treated as a delimiter.

```js
const stream = new ReadStream('a,,b,c,');
await stream.readDelimitedBy(','); // Promise<'a'>
// stream is now ',b,c'
await stream.readDelimitedBy(','); // Promise<''>
// stream is now 'b,c'
await stream.readDelimitedBy(','); // Promise<'b'>
// stream is now 'c'
await stream.readDelimitedBy(','); // Promise<'c'>
// stream is now ''
await stream.readDelimitedBy(','); // Promise<null> - NOT Promise<''>
```

### readStream.peek([encoding])
### readStream.peek(byteCount, [encoding])

Like `readStream.read`, but doesn't remove the read data from the read queue.

Can return synchronously. Use `await` or wrap the return value in `Promise.resolve()` if you need a Promise.

### readStream.readBuffer()
### readStream.readBuffer(byteCount)
### readStream.peekBuffer()
### readStream.peekBuffer(byteCount)

Like `readStream.read` and `readStream.peek`, but returns a Buffer instead of a string.
