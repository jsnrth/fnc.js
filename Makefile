TESTS = test/**/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --ui tdd \
			--reporter dot \
			--slow 20 \
			--growl \
			$(TESTS)

.PHONY: test
