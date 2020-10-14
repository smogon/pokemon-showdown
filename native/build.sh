#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
gcc -I. -g -fPIC -shared "$DIR/fts_id_tokenizer.c" -o "$DIR/fts_id_tokenizer.o"
