TESTS = test/**/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
			--reporter dot \
			--slow 20 \
			--growl \
			$(TESTS)

.PHONY: test
