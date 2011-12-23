all:
	node-waf configure build

tests:
	nodejs ./test.js

install:
	@mkdir -p ~/.node_libraries && cp ./build/default/hashlib.node ~/.node_libraries/hashlib.node

all: build install

tests:
	@node ./test.js
  
clean:
	@rm -rf ./build
