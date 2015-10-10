
build: node_modules
	NODE_ENV=production ./node_modules/.bin/webpack \
		--config webpack.config.js \
		--optimize-minimize \
		--optimize-dedupe \
		--colors

local: node_modules

node_modules: package.json
	npm install
	touch $@

run:
	node server.js

hint:
	./node_modules/.bin/eslint ./js ./test/spec

test: hint
	./node_modules/.bin/mocha --colors --recursive tests/*

test_debug:
	./node_modules/.bin/mocha debug --colors --recursive tests/*
