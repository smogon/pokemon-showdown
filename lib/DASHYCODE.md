Dashycode
=========

Dashycode is a code for arbitrary strings into a restricted lowercase-alphanumeric-with-dashes character set.

For instance:

    > Dashycode.encode("What IS Dashycode, really? 🤔")
    'what-is-dashycode-really--3x2awuinvx5eznar3'

    > Dashycode.decode('what-is-dashycode-really--3x2awuinvx5eznar3')
    'What IS Dashycode, really? 🤔'

Its intended use is to reversibly store arbitrary strings in URLs or domain-names as human-readably as possible.

Dashycode is similar to other ways of encoding strings into restricted character sets, like urlencoding, punycode, or Base64. It's more human-readable than urlencoding or Base64, and can handle strings punycode can't handle.


# Features

Dashycode's output is guaranteed to be a valid domain name (ignoring length considerations). In addition to containing only lowercase alphanumeric characters and dashes, it is guaranteed to be non-empty, and to never start nor end with a dash.

    > Dashycode.encode("")
    '0--0'

    > Dashycode.encode(" ")
    '0--05'

    > Dashycode.encode("日本語")
    '0--0htdqm79vxb74'

As an encoding, Dashycode is reversible: any string will always encode to a unique output which decodes to that exact original string. Everything is preserved: capitalization, whitespace, etc.

    > Dashycode.decode("0--0")
    ''

    > Dashycode.decode("0--05")
    ' '

    > Dashycode.decode("0--0htdqm79vxb74")
    '日本語'

Dashycode is designed for human-readable text, but any data you can stuff into a JavaScript string can be encoded. However, if you primarily want to encode binary data, you should probably be using [Base32]. (Dashycode is ~20% less efficient than Base32 for max-entropy binary data.)

  [Base32]: https://en.wikipedia.org/wiki/Base32


# Readability

Dashycode tries to be maximally readable. Strings containing only lowercase alphanumeric characters are returned unmodified:

    > Dashycode.encode("lettersandnumb3rsonly")
    'lettersandnumb3rsonly'

Strings containing spaces are returned with dashes:

    > Dashycode.encode("this is a lowercase sentence")
    'this-is-a-lowercase-sentence'

Only strings with other characters (or with multiple spaces in a row) will have an additional code tacked onto the end, in a way that maximizes readability:

    > Dashycode.encode("This is a regular sentence.")
    'this-is-a-regular-sentence--32e5'

Also for readability, the code part will not contain `0`, `o`, `l`, or `1`.


# Compared to other encodings

Dashycode encodes/decodes text, like urlencoding or Punycode.

Of these, Dashycode is most similar to Punycode, in terms of readability as well as being a valid domain name. The main difference is that Punycode is not designed to encode all text, and cannot create a valid domain name if the input contains ASCII symbols.

    > punycode.encode("This is *&@^$&")
    'This is *&@^$&-'

    > Dashycode.encode("This is *&@^$&")
    'this-is--3mbqscmxi7'

Compared to urlencoding, Dashycode is much more readable.

    > encodeURIComponent("100% of sentences should be readable")
    '100%25%20of%20sentences%20should%20be%20readable'

    > Dashycode.encode("100% of sentences should be readable")
    '100-of-sentences-should-be-readable--ke'

Dashycode is only ~20% less efficient than Punycode on pure non-ASCII text:

    > punycode.encode("日本語はいい言語と思います。")
    'r6j3gaa9hwd0b0h4388bzcm1md968luxbea'

    > Dashycode.encode("日本語はいい言語と思います。")
    '0--0htdqm79vxb7yh5eg4389j2m52cwxb7ya5eyg2e9j2mvhitm7sw42e'

The reason for the slightly lower efficiency on non-ASCII text is to make common ASCII text very efficient:

    > Dashycode.encode("Add dash dash three to capitalize")
    'add-dash-dash-three-to-capitalize--3'

    > Dashycode.encode("CamelCase")
    'camelcase--fa'


# License

MIT license
